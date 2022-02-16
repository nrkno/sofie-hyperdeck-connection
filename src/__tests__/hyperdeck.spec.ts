/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Socket as MockSocket } from 'net'
import { Hyperdeck } from '../hyperdeck'
import { StopCommand } from '../commands'

jest.mock('net')
const setTimeoutOrg = setTimeout

async function waitALittleBit() {
	return new Promise((resolve) => {
		setTimeoutOrg(resolve, 10)
	})
}

describe('Hyperdeck', () => {
	let now = 10000
	beforeAll(() => {
		Date.now = jest.fn(() => {
			return getCurrentTime()
		})
	})
	function getCurrentTime() {
		return now
	}
	function advanceTime(advanceTime: number) {
		now += advanceTime
		jest.advanceTimersByTime(advanceTime)
	}
	beforeEach(() => {
		now = 10000
	})

	test('Check simple connection', async () => {
		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)

		expect(onSocketCreate).toHaveBeenCalledTimes(1)
		expect(onSocketWrite).toHaveBeenCalledTimes(0)
	})

	test('Check connection retry', async () => {
		jest.useFakeTimers()

		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onDisconnection = jest.fn()
		const onSocketWrite = jest.fn()

		let thisSocket: any
		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}
			socket.onClose = onDisconnection
			socket.onWrite = onSocketWrite
			thisSocket = socket
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onDisconnection).toHaveBeenCalledTimes(0)

		thisSocket?.destroy()
		await waitALittleBit()

		expect(hp.connected).toBeFalsy()
		expect(onDisconnection).toHaveBeenCalledTimes(1)

		advanceTime(6000)

		expect(onSocketCreate).toHaveBeenCalledTimes(1)
		expect(onSocketWrite).toHaveBeenCalledTimes(0)
	})

	// eslint-disable-next-line jest/no-commented-out-tests
	// test('Check protocol version', async () => {
	// 	let onSocketCreate = jest.fn()
	// 	let onConnection = jest.fn()
	// 	let onSocketWrite = jest.fn()

	// 	// @ts-ignore MockSocket
	// 	MockSocket.mockOnNextSocket((socket: any) => {
	// 		onSocketCreate(onSocketCreate)

	// 		socket.onConnect = () => {
	// 			socket.mockData('500 connection info:\r\nprotocol version: 9.9\r\nmodel: test\r\n\r\n')
	// 			onConnection()
	// 		}

	// 		socket.onWrite = onSocketWrite
	// 	})

	// 	const hp = new Hyperdeck({ pingPeriod: 0 })

	// 	let onClientConnection = jest.fn()
	// 	let onClientError = jest.fn()
	// 	hp.on('connected', onClientConnection)
	// 	hp.on('error', onClientError)

	// 	hp.connect('127.0.0.1')
	// 	await waitALittleBit()

	// 	expect(hp.connected).toBeFalsy()
	// 	expect(onClientConnection).toHaveBeenCalledTimes(0)
	// 	expect(onClientError).toHaveBeenCalledTimes(1)
	// 	expect(onConnection).toHaveBeenCalledTimes(1)

	// 	expect(onSocketCreate).toHaveBeenCalledTimes(1)
	// 	expect(onSocketWrite).toHaveBeenCalledTimes(0)
	// })

	test('Check ping setup', async () => {
		jest.useFakeTimers()

		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite

			socket.mockExpectedWrite('watchdog:\r\nperiod: 13\r\n\r\n', '200 ok\r\n')
			socket.mockExpectedWrite('ping\r\n', '200 ok\r\n')
		})

		const hp = new Hyperdeck({ pingPeriod: 12000 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)

		expect(onSocketCreate).toHaveBeenCalledTimes(1)
		expect(onSocketWrite).toHaveBeenCalledTimes(1)

		// Advance so that a ping should send
		advanceTime(12200)
		expect(onSocketWrite).toHaveBeenCalledTimes(2)

		// Advance so socket times out
		advanceTime(15000)

		expect(hp.connected).toBeFalsy()

		await hp.disconnect()
	})

	test('Check send command correct response', async () => {
		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite

			socket.mockExpectedWrite('stop\r\n', '200 ok\r\n')
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		const onResolve = jest.fn()
		await hp.sendCommand(new StopCommand()).then(onResolve)

		expect(onSocketWrite).toHaveBeenCalledTimes(1)
		expect(onResolve).toHaveBeenCalledTimes(1)
	})

	test('Check send command bad response', async () => {
		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite

			socket.mockExpectedWrite('stop\r\n', '202 wrong\r\n')
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		const onResolve = jest.fn()
		hp.sendCommand(new StopCommand()).catch(onResolve)

		await waitALittleBit()
		expect(onSocketWrite).toHaveBeenCalledTimes(1)
		expect(onResolve).toHaveBeenCalledTimes(1)
	})

	test('Check async', async () => {
		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		let thisSocket: any
		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite
			thisSocket = socket
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		const onAsyncReceive = jest.fn()
		hp.on('notify.slot', onAsyncReceive)

		thisSocket.mockData('502 fake slot async')

		await waitALittleBit()
		expect(onAsyncReceive).toHaveBeenCalledTimes(1)
	})

	test('Check async middle of command', async () => {
		const onSocketCreate = jest.fn()
		const onConnection = jest.fn()
		const onSocketWrite = jest.fn()

		let thisSocket: any
		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite
			thisSocket = socket

			// instead respond with unrelated async
			socket.mockExpectedWrite('stop\r\n', '502 slot async\r\n')
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })

		const onClientConnection = jest.fn()
		const onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		const onAsyncReceive = jest.fn()
		hp.on('notify.slot', onAsyncReceive)

		const onResolve = jest.fn()
		const res = hp.sendCommand(new StopCommand()).then(onResolve)

		await waitALittleBit()
		expect(onAsyncReceive).toHaveBeenCalledTimes(1)

		expect(onResolve).toHaveBeenCalledTimes(0) // should not have resolved as we havent sent the response

		thisSocket.mockData('200 ok\r\n')
		await res
	})
})
/* eslint-enable @typescript-eslint/ban-ts-comment */
