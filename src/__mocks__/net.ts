import { EventEmitter } from 'events'
const setTimeoutOrg = setTimeout
const sockets: Array<Socket> = []
// eslint-disable-next-line @typescript-eslint/ban-types
const onNextSocket: Array<Function> = []

export class Socket extends EventEmitter {
	public onWrite: (buff: Buffer, encoding: string) => void
	public onConnect: (port: number, host: string) => void
	public onClose: () => void

	public expectedWrites: { call: string; response: string }[] = []

	private _connected = false

	constructor() {
		super()

		const cb = onNextSocket.shift()
		if (cb) {
			cb(this)
		}

		sockets.push(this)
	}

	public static mockSockets(): Socket[] {
		return sockets
	}
	public static mockOnNextSocket(cb: (s: Socket) => void): void {
		onNextSocket.push(cb)
	}
	// this.emit('connect')
	// this.emit('close')
	// this.emit('end')

	public setEncoding(_enc: string): void {
		return
	}

	public mockExpectedWrite(call: string, response: string): void {
		this.expectedWrites.push({ call, response })
	}

	public connect(port: number, host: string, cb: () => void): void {
		if (this.onConnect) this.onConnect(port, host)
		setTimeoutOrg(() => {
			if (cb) {
				cb()
			}

			this.setConnected()
		}, 3)
	}
	public write(buff: Buffer, encoding = 'utf8'): void {
		expect(this.expectedWrites).not.toHaveLength(0)

		const w = this.expectedWrites.shift()
		if (w) {
			expect(buff).toEqual(w.call)
			this.emit('data', w.response)
		}

		if (this.onWrite) {
			this.onWrite(buff, encoding)
		}
	}
	public end(): void {
		this.setEnd()
		this.setClosed()
	}

	public mockClose(): void {
		this.setClosed()
	}
	public mockData(data: Buffer): void {
		this.emit('data', data)
	}

	private setConnected(): void {
		if (this._connected !== true) {
			this._connected = true
		}
		this.emit('connect')
	}
	private setClosed(): void {
		if (this._connected !== false) {
			this._connected = false
		}
		this.emit('close')
		if (this.onClose) this.onClose()
	}
	private setEnd(): void {
		if (this._connected !== false) {
			this._connected = false
		}
		this.emit('end')
	}
}
