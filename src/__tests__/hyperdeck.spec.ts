
import { Socket as MockSocket } from 'net'
import { Hyperdeck } from '../hyperdeck'
import { StopCommand } from '../commands';

jest.mock('net')
let setTimeoutOrg = setTimeout

function waitALittleBit () {
	return new Promise((resolve) => {
		setTimeoutOrg(resolve, 10)
	})
}

describe('Hyperdeck', () => {
	let now: number = 10000
	beforeAll(() => {
		Date.now = jest.fn(() => {
			return getCurrentTime()
		})
	})
	function getCurrentTime () {
		return now
	}
	function advanceTime (advanceTime: number) {
		now += advanceTime
		jest.advanceTimersByTime(advanceTime)
	}
	beforeEach(() => {
		now = 10000
	})
	
	test('Check simple connection', async () => {
		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
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

		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onDisconnection = jest.fn()
		let onSocketWrite = jest.fn()
		
		let thisSocket
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onDisconnection).toHaveBeenCalledTimes(0)

		thisSocket.end()
		await waitALittleBit()
		
		expect(hp.connected).toBeFalsy()
		expect(onDisconnection).toHaveBeenCalledTimes(1)
		
		advanceTime(6000)

		expect(onSocketCreate).toHaveBeenCalledTimes(1)
		expect(onSocketWrite).toHaveBeenCalledTimes(0)
	})
	
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

		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
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

		hp.disconnect()
	})

	test('Check send command correct response', async () => {
		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		let onResolve = jest.fn()
		const stopCommand = new StopCommand()
		stopCommand.then(onResolve)
		hp.sendCommand(stopCommand)
		
		await waitALittleBit()
		expect(onSocketWrite).toHaveBeenCalledTimes(1)
		expect(onResolve).toHaveBeenCalledTimes(1)
	})

	test('Check send command bad response', async () => {
		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		let onResolve = jest.fn()
		const stopCommand = new StopCommand()
		stopCommand.catch(onResolve)
		hp.sendCommand(stopCommand)
		
		await waitALittleBit()
		expect(onSocketWrite).toHaveBeenCalledTimes(1)
		expect(onResolve).toHaveBeenCalledTimes(1)
	})

	test('Check async', async () => {
		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
		let thisSocket
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
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		let onAsyncReceive = jest.fn()
		hp.on('notify.slot', onAsyncReceive)

		thisSocket.mockData('502 fake slot async')
		
		await waitALittleBit()
		expect(onAsyncReceive).toHaveBeenCalledTimes(1)
	})

	test('Check async middle of command', async () => {
		let onSocketCreate = jest.fn()
		let onConnection = jest.fn()
		let onSocketWrite = jest.fn()
		
		// @ts-ignore MockSocket
		MockSocket.mockOnNextSocket((socket: any) => {
			onSocketCreate(onSocketCreate)

			socket.onConnect = () => {
				socket.mockData('500 connection info:\r\nprotocol version: 1.6\r\nmodel: test\r\n\r\n')
				onConnection()
			}

			socket.onWrite = onSocketWrite
			
			// instead respond with unrelated async
			socket.mockExpectedWrite('stop\r\n', '502 slot async\r\n')
		})

		const hp = new Hyperdeck({ pingPeriod: 0 })
		
		let onClientConnection = jest.fn()
		let onClientError = jest.fn()
		hp.on('connected', onClientConnection)
		hp.on('error', onClientError)

		hp.connect('127.0.0.1')
		await waitALittleBit()

		expect(hp.connected).toBeTruthy()
		expect(onClientConnection).toHaveBeenCalledTimes(1)
		expect(onClientError).toHaveBeenCalledTimes(0)
		expect(onConnection).toHaveBeenCalledTimes(1)
		expect(onSocketCreate).toHaveBeenCalledTimes(1)

		let onAsyncReceive = jest.fn()
		hp.on('notify.slot', onAsyncReceive)

		let onResolve = jest.fn()
		const stopCommand = new StopCommand()
		stopCommand.then(onResolve)
		hp.sendCommand(stopCommand)
		
		await waitALittleBit()
		expect(onAsyncReceive).toHaveBeenCalledTimes(1)
		
		expect(onResolve).toHaveBeenCalledTimes(0) // should not have resolved as we havent sent the response
	})
	
})
