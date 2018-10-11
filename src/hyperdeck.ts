import { EventEmitter } from 'events'
import { Socket } from 'net'
import * as _ from 'underscore'

import { ResponseCodeType, GetResponseCodeType, AsynchronousCode } from './codes'
import { AbstractCommand, TransportInfoChange } from './commands'
import { ResponseMessage, NamedMessage } from './message'
import { DummyConnectCommand } from './commands/connect'

export interface HyperdeckOptions {
	// address?: string,
	// port?: number,
	debug?: boolean,
	externalLog?: (arg0?: any, arg1?: any, arg2?: any, arg3?: any) => void
}

export class Hyperdeck extends EventEmitter {
	DEFAULT_PORT = 9993
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	event: EventEmitter
	private socket: Socket
	private _log: (...args: any[]) => void
	private _commandQueue: AbstractCommand[] = []

	constructor (options?: HyperdeckOptions) {
		super()
		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
			this._log = options.externalLog || function (...args: any[]): void {
				console.log(...args)
			}
		}
        
        this.socket = new Socket({
			// host: (options || {}).address,
			// port: (options || {}).port
        });
        this.socket.setEncoding('utf8')
        
		// this.socket.on('receivedStateChange', (command: AbstractCommand) => this._mutateState(command))
		this.socket.on('error', (e) => this.emit('error', e))
		// this.socket.on('connect', () => this.emit('connected'))
        this.socket.on('end', () => this.emit('disconnected')) // TODO - should this be on close?
        this.socket.on('data', (d) => this._handleData((d as any) as string)) // TODO - fix this casting mess
        
        this._log('init')
	}

	connect (address: string, port?: number) {
        // TODO - ensure not already connected

        const connCommand = new DummyConnectCommand()
        connCommand.then(c => {
            if (c.ProtocolVersion !== 1.6) {
                throw 'unknown protocol version: ' + c.ProtocolVersion
            }
            this.emit('connected', c)
        }, e => {
            // TODO - clean up connection etc
            this._log('connection failed', e)
        })
        this._commandQueue = [connCommand]
        //this._commandQueue.unshift(connCommand)

		return this.socket.connect(port || this.DEFAULT_PORT, address)
	}

	disconnect (): Promise<void> {
        // TODO - flatten this?
        return Promise.reject()
		// return new Promise((resolve, reject) => {
		// 	this.socket.disconnect().then(() => resolve()).catch(reject)
		// })
    }
    
    private _sendQueuedCommand() {
        if (this._commandQueue.length === 0) return
        const cmd = this._commandQueue[0]
        const sent = this._sendCommand(cmd)

        // Not waiting for a response so immediately send the next, or the command failed to serialize
        if (!sent || cmd.expectedResponseCode === null) {
            // cmd.markSent()

            this._commandQueue.pop()
            this._sendQueuedCommand()
        }
    }

    private _buildMessageStr(msg: NamedMessage) {
        if (_.isEmpty(msg.Params)) {
            return msg.Name + '\r\n'
        }

        let str = msg.Name + ':\r\n'
        _.forEach(msg.Params, (v, k) => {
            str += k + ': ' + v + '\r\n'
        })
    
        return str + '\r\n'
    }

    private _sendCommand(command: AbstractCommand): boolean {
        const msg = command.serialize()
        if (msg === null) return false

        const cmdString = this._buildMessageStr(msg)
        if (this.DEBUG) this._log('sending str:', cmdString)

        try {
            this.socket.write(cmdString)

            command.markSent()
            return true

        } catch (e) {
            // TODO - better handling
            this._log(e)
            return false
        }
    }

	sendCommand (command: AbstractCommand) {
        this._commandQueue.push(command)

        if (this._commandQueue.length === 1) {
            this._sendQueuedCommand()
        }
    }

    private _pendingLines: string[] = []
    private _handleData (data: string) {
        // add new lines to processing queue
        const newLines = data.split('\r\n')
        this._pendingLines = this._pendingLines.concat(newLines)

        while(this._pendingLines.length > 0) {
            // skip any blank lines
            if (this._pendingLines[0] === '') {
                this._pendingLines.pop()
                continue
            }

            // if the first line has no colon, then it is a single line
            if (this._pendingLines[0].indexOf(':') === -1) {
                this._parseResponse(this._pendingLines.splice(0, 1))
                continue
            }
    
            const endLine = this._pendingLines.indexOf('')
            if (endLine === -1) {
                // Not got full response yet
                return
            }
    
            const lines = this._pendingLines.splice(0, endLine + 1)
            this._parseResponse(lines)
        }
    }

    private _parseResponse (lines: string[]) {
        if (lines.length === 0) return

        lines = lines.map(l => l.trim()) // TODO - ensure this is safe with dodgey clip names

        const headerMatch = lines[0].match(/^(\d+) (.+?)(:|)$/im)
        if (!headerMatch) {
            // TODO
            console.log('bad response header')
            return
        }

        const code = parseInt(headerMatch[1])
        const msg = headerMatch[2]

        const params: { [key: string]: string } = {}

        for (let i=1; i<lines.length; i++) {
            const lineMatch = lines[i].match(/^(.*?): (.*)$/im)
            if (!lineMatch) continue // TODO fail because of bad line?

            params[lineMatch[1]] = lineMatch[2]
        }

        const resMsg: ResponseMessage = {
            Code: code,
            Name: msg,
            Params: params,
        }

        const codeType = GetResponseCodeType(code)
        if (codeType === ResponseCodeType.Unknown) {
            // TODO properly
            console.log('really unknown response code...')
            return
        }

        if (this.DEBUG) this._log('res', resMsg)

        const codeIsAsync = codeType === ResponseCodeType.Asynchronous
        if (codeIsAsync) {
            this._handleAsyncResponse(resMsg)
            // leave it to fall through in case the queued command is waiting for an async response
        }

        if (this._commandQueue.length > 0 && (!codeIsAsync || this._commandQueue[0].expectedResponseCode === code)) {
            // this belongs to the command, so handle it
            const cmd = this._commandQueue[0]
            this._commandQueue.pop()

            cmd.handle(resMsg)
            this._sendQueuedCommand()
        }
    }

    private _handleAsyncResponse(msg: ResponseMessage) {
        // TODO - refactor to pick the handler dynamically
        switch (msg.Code) {
            case AsynchronousCode.TransportInfo:
                {
                    const handler = new TransportInfoChange()
                    const r = handler.deserialize(msg)
                    this.emit('transportInfo', r)
                }
                break
            default:
                this._log('unknown async response:', msg)
                break
        }
    }
}
