import { EventEmitter } from 'events'
let setTimeoutOrg = setTimeout
const sockets: Array<Socket> = []
const onNextSocket: Array<Function> = []

export class Socket extends EventEmitter {

	public onWrite: (buff: Buffer, encoding: string) => void
	public onConnect: (port: number, host: string) => void
	public onClose: () => void

	public expectedWrites: { call: string, response: string }[] = []

	private _connected: boolean = false

	constructor () {
		super()

		let cb = onNextSocket.shift()
		if (cb) {
			cb(this)
		}

		sockets.push(this)
	}

	public static mockSockets () {
		return sockets
	}
	public static mockOnNextSocket (cb: (s: Socket) => void) {
		onNextSocket.push(cb)
	}
	// this.emit('connect')
	// this.emit('close')
	// this.emit('end')

	public setEncoding () {
	}

	public mockExpectedWrite(call: string, response: string) {
		this.expectedWrites.push({ call, response })
	}

	public connect (port, host, cb) {
		if (this.onConnect) this.onConnect(port, host)
		setTimeoutOrg(() => {
			if (cb)
				cb()

			this.setConnected()
		}, 3)

	}
	public write (buff: Buffer, encoding: string = 'utf8') {
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
	public end () {
		this.setEnd()
		this.setClosed()
	}

	public mockClose () {
		this.setClosed()
	}
	public mockData (data: Buffer) {
		this.emit('data', data)
	}

	private setConnected () {
		if (this._connected !== true) {
			this._connected = true
		}
		this.emit('connect')
	}
	private setClosed () {
		if (this._connected !== false) {
			this._connected = false
		}
		this.emit('close')
		if (this.onClose) this.onClose()
	}
	private setEnd () {
		if (this._connected !== false) {
			this._connected = false
		}
		this.emit('end')
	}
}
