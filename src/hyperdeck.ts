import { EventEmitter } from 'events'
import { Socket } from 'net'

import { ResponseCodeType, GetResponseCodeType, AsynchronousCode } from './codes'
import { AbstractCommand } from './commands'
import * as AsyncHandlers from './asyncHandlers'
import { ResponseMessage } from './message'
import { DummyConnectCommand, WatchdogPeriodCommand, PingCommand, QuitCommand } from './commands/internal'
import { buildMessageStr, MultilineParser } from './parser'

export interface HyperdeckOptions {
	pingPeriod?: number // set to 0 to disable
	debug?: boolean
	externalLog?: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void
}

class QueuedCommand {
	public readonly promise: Promise<any>
	public readonly command: AbstractCommand

	constructor(command: AbstractCommand) {
		this.command = command
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}

	resolve(_res: any) {
		throw new Error('No promise to resolve')
	}
	reject(_res: any) {
		throw new Error('No promise to reject')
	}
}

export class Hyperdeck extends EventEmitter {
	DEFAULT_PORT = 9993
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	private socket: Socket
	private _connected = false
	private _retryConnectTimeout: NodeJS.Timer | null = null
	private _log: (...args: any[]) => void
	private _commandQueue: QueuedCommand[] = []
	private _pingPeriod = 5000
	private _pingInterval: NodeJS.Timer | null = null
	private _lastCommandTime = 0
	private _asyncHandlers: { [key: number]: AsyncHandlers.IHandler } = {}
	private _parser: MultilineParser

	private _connectionActive = false // True when connected/connecting/reconnecting
	private _host = ''
	private _port = this.DEFAULT_PORT

	constructor(options?: HyperdeckOptions) {
		super()

		this._log = function (...args: any[]): void {
			console.log(...args)
		}

		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
			this._log = options.externalLog || this._log
			if (options.pingPeriod !== undefined) this._pingPeriod = options.pingPeriod
		}

		this._parser = new MultilineParser(this.DEBUG, this._log)

		this.socket = new Socket()
		this.socket.setEncoding('utf8')
		this.socket.on('error', (e) => this.emit('error', e))
		this.socket.on('close', () => {
			if (this._connected) this.emit('disconnected')
			this._connected = false

			if (this._pingInterval) {
				clearInterval(this._pingInterval)
				this._pingInterval = null
			}

			this._triggerRetryConnection()
		})
		this.socket.on('data', (d) => this._handleData(d.toString()))

		for (const h in AsyncHandlers) {
			try {
				const handler: AsyncHandlers.IHandler = new (AsyncHandlers as any)[h]()
				this._asyncHandlers[handler.responseCode] = handler
			} catch (e) {
				// ignore as likely not a class
			}
		}
	}

	connect(address: string, port?: number): void {
		if (this._connected) return
		if (this._connectionActive) return
		this._connectionActive = true

		this._host = address
		this._port = port || this.DEFAULT_PORT
		this._connectInner()
	}

	async disconnect(): Promise<void> {
		this._connectionActive = false
		if (this._retryConnectTimeout) {
			clearTimeout(this._retryConnectTimeout)
		}

		if (!this._connected) return Promise.resolve()

		await this.sendCommand(new QuitCommand())
		this.socket.end()
	}

	sendCommand(command: AbstractCommand): Promise<any> {
		if (!this._connected) return Promise.reject()

		const res = this._queueCommand(command)
		this._logDebug('queued:', this._commandQueue.length)

		if (this._commandQueue.length === 1) {
			this._sendQueuedCommand()
		}

		return res
	}

	get connected(): boolean {
		return this._connected
	}

	private _triggerRetryConnection() {
		if (!this._retryConnectTimeout) {
			this._retryConnectTimeout = setTimeout(() => {
				this._retryConnection()
			}, this.RECONNECT_INTERVAL)
		}
	}
	private _retryConnection() {
		if (this._retryConnectTimeout) {
			clearTimeout(this._retryConnectTimeout)
			this._retryConnectTimeout = null
		}

		if (!this.connected && this._connectionActive) {
			try {
				this._connectInner()
			} catch (e) {
				this._triggerRetryConnection()
				this.emit('error', 'connection failed', e)
				this._log('connection failed', e)
			}
		}
	}

	private _connectInner(): void {
		this._commandQueue = []
		this._queueCommand(new DummyConnectCommand())
			.then((c) => {
				// TODO - we can filter supported versions here. for now we shall not as it is likely that there will not be any issues
				// if (c.protocolVersion !== 1.6) {
				// 	throw new Error('unknown protocol version: ' + c.protocolVersion)
				// }

				if (this._pingPeriod > 0) {
					const cmd = new WatchdogPeriodCommand(1 + Math.round(this._pingPeriod / 1000))

					// force the command to send
					this._commandQueue = []
					const prom = this._queueCommand(cmd)
					this._sendQueuedCommand()
					return prom
						.then(() => {
							this._logDebug('ping: setting up')
							this._pingInterval = setInterval(() => {
								if (this.connected) this._performPing().catch((e) => this.emit('error', e))
							}, this._pingPeriod)
						})
						.then(() => c)
				}

				return c
			})
			.then((c) => {
				this._connected = true
				this.emit('connected', c)
			})
			.catch((e) => {
				this._connected = false
				this.socket.end()
				this.emit('error', 'connection failed', e)
				this._log('connection failed', e)

				this._triggerRetryConnection()
			})

		this.socket.connect(this._port, this._host)
	}

	private async _performPing() {
		const timeout = this._pingPeriod + 1500
		if (Date.now() - this._lastCommandTime > timeout) {
			this._log('ping: timed out')
			this._connected = false
			this.emit('disconnected')
			this._triggerRetryConnection()
		} else if (this._commandQueue.length > 0) {
			// There are commands queued, which will reset the ping timers once executed
			this._logDebug('ping: queue has commands')
		} else {
			this._logDebug('ping: queueing')
			await this.sendCommand(new PingCommand())
		}
	}

	private _sendQueuedCommand() {
		this._logDebug('try send:', this._commandQueue.length)

		if (this._commandQueue.length === 0) return
		const cmd = this._commandQueue[0]
		const sent = this._sendCommand(cmd)

		// Command failed to send, so move on to the next
		if (!sent) {
			this._commandQueue.shift()
			this._sendQueuedCommand()
		}
	}

	private _queueCommand(command: AbstractCommand): Promise<any> {
		const cmdWrapper = new QueuedCommand(command)
		this._commandQueue.push(cmdWrapper)
		return cmdWrapper.promise
	}

	private _sendCommand(command: QueuedCommand): boolean {
		const msg = command.command.serialize()
		if (msg === null) return false

		const cmdString = buildMessageStr(msg)
		this._logDebug('sending str:', cmdString)

		try {
			this.socket.write(cmdString)
			this._lastCommandTime = Date.now()

			return true
		} catch (e) {
			this._log('socket write failed', e)
			try {
				this.socket.end()
			} catch (e2) {
				// ignore
			}
			return true // It failed, but there is no point trying to send another command
		}
	}

	private _handleData(data: string) {
		const msgs = this._parser.receivedString(data)
		msgs.forEach((resMsg) => {
			const codeType = GetResponseCodeType(resMsg.code)
			if (codeType === ResponseCodeType.UNKNOWN) {
				this._log('unknown response:', resMsg)
				return
			}

			this._logDebug('res', resMsg)

			const codeIsAsync = codeType === ResponseCodeType.ASYNCHRONOUS
			if (codeIsAsync) {
				this._handleAsyncResponse(resMsg)
				// leave it to fall through in case the queued command is waiting for an async response
			}

			if (
				this._commandQueue.length > 0 &&
				(!codeIsAsync || this._commandQueue[0].command.expectedResponseCode === resMsg.code)
			) {
				const cmd = this._commandQueue[0]
				this._commandQueue.shift()

				if (cmd.command.expectedResponseCode === resMsg.code) {
					cmd.resolve(cmd.command.deserialize(resMsg))
				} else {
					cmd.reject(resMsg)
				}

				this._sendQueuedCommand()
			}
		})
	}

	private _handleAsyncResponse(msg: ResponseMessage) {
		switch (msg.code) {
			case AsynchronousCode.ConnectionInfo:
				// Only received at startup, and handled by a command
				return
		}

		const h = this._asyncHandlers[msg.code]
		if (h) {
			this.emit(h.eventName, h.deserialize(msg))
		} else {
			this._log('unknown async response:', msg)
		}
	}

	private _logDebug(...args: any[]) {
		if (this.DEBUG) this._log(...args)
	}
}
