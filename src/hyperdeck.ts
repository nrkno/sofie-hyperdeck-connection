import { EventEmitter } from 'events'
import { Socket } from 'net'

import { ResponseCodeType, GetResponseCodeType, AsynchronousCode } from './codes'
import { ICommand } from './commands'
import * as AsyncHandlers from './asyncHandlers'
import { ResponseMessage } from './message'
import { DummyConnectCommand, WatchdogPeriodCommand, PingCommand } from './commands/internal'
import { buildMessageStr, MultilineParser } from './parser'

export interface HyperdeckOptions {
	pingPeriod?: number // set to 0 to disable
	debug?: boolean
	externalLog?: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void
}

export class Hyperdeck extends EventEmitter {
	DEFAULT_PORT = 9993
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	event: EventEmitter
	private socket: Socket
	private _log: (...args: any[]) => void
	private _commandQueue: ICommand[] = []
	private _pingPeriod: number = 5000
	private _pingInterval: NodeJS.Timer | null = null
	private _lastCommandTime: number = 0
	private _asyncHandlers: {[key: number]: AsyncHandlers.IHandler} = {}
	private _parser: MultilineParser

	constructor (options?: HyperdeckOptions) {
		super()
		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
			this._log = options.externalLog || function (...args: any[]): void {
				console.log(...args)
			}
			if (options.pingPeriod !== undefined) this._pingPeriod = options.pingPeriod
		}

		this._parser = new MultilineParser(this.DEBUG, this._log)

		this.socket = new Socket()
		this.socket.setEncoding('utf8')
		this.socket.on('error', (e) => this.emit('error', e))
		this.socket.on('end', () => {
			if (this._pingInterval) {
				clearInterval(this._pingInterval)
				this._pingInterval = null
			}

			this.emit('disconnected')
		}) // TODO - should this be on close?
		this.socket.on('data', (d) => this._handleData((d as any) as string)) // TODO - fix this casting mess

		for (const h in AsyncHandlers) {
			try {
				const handler: AsyncHandlers.IHandler = new (AsyncHandlers as any)[h]()
				this._asyncHandlers[handler.responseCode] = handler
			} catch (e) {
				// ignore as likely not a class
			}
		}
	}

	connect (address: string, port?: number) {
		// TODO - ensure not already connected

		const connCommand = new DummyConnectCommand()
		connCommand.then(c => {
			if (c.protocolVersion !== 1.6) {
				throw new Error('unknown protocol version: ' + c.protocolVersion)
			}

			if (this._pingPeriod > 0) {
				const cmd = new WatchdogPeriodCommand(1 + Math.round(this._pingPeriod / 1000))
				this.sendCommand(cmd)
				return cmd.then(() => {
					this._logDebug('ping: setting up')
					this._pingInterval = setInterval(() => this._performPing(), this._pingPeriod)
				}).then(() => c)
			}

			return c
		}).then((c) => {
			this.emit('connected', c)
		}).catch(e => {
			// TODO - clean up connection etc
			this._log('connection failed', e)
		})
		this._commandQueue = [connCommand]

		this.socket.connect(port || this.DEFAULT_PORT, address)
	}

	disconnect (): Promise<void> {
		// TODO - flatten this?
		return Promise.reject()
		// return new Promise((resolve, reject) => {
		// 	this.socket.disconnect().then(() => resolve()).catch(reject)
		// })
	}

	sendCommand (...commands: ICommand[]) {

		// TODO - abort if not connected, but make sure watchdog still gets sent
		commands.forEach(command => {
			this._commandQueue.push(command)
			this._logDebug('queued:', this._commandQueue.length)
		})

		if (this._commandQueue.length === 1) {
			this._sendQueuedCommand()
		}
	}

	private _performPing () {
		const timeout = this._pingPeriod + 1500
		if (Date.now() - this._lastCommandTime > timeout) {
			this._log('ping: timed out')
			// TODO - timed out
		} else if (this._commandQueue.length > 0) {
			// There are commands queued, which will reset the ping timers once executed
			this._logDebug('ping: queue has commands')
		} else {
			this._logDebug('ping: queueing')
			this.sendCommand(new PingCommand())
		}
	}

	private _sendQueuedCommand () {
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

	private _sendCommand (command: ICommand): boolean {
		const msg = command.serialize()
		if (msg === null) return false

		const cmdString = buildMessageStr(msg)
		this._logDebug('sending str:', cmdString)

		try {
			this.socket.write(cmdString)
			this._lastCommandTime = Date.now()

			return true

		} catch (e) {
			// TODO - better handling
			this._log(e)
			return false
		}
	}

	private _handleData (data: string) {
		const msgs = this._parser.receivedString(data)
		msgs.forEach(resMsg => {
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

			if (this._commandQueue.length > 0 && (!codeIsAsync || this._commandQueue[0].expectedResponseCode === resMsg.code)) {
				const cmd = this._commandQueue[0]
				this._commandQueue.shift()

				cmd.handle(resMsg)
				this._sendQueuedCommand()
			}
		})
	}

	private _handleAsyncResponse (msg: ResponseMessage) {
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

	private _logDebug (...args: any[]) {
		if (this.DEBUG) this._log(...args)
	}
}
