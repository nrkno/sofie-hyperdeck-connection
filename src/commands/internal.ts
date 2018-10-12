import { AsynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase, AbstractCommandBaseNoResponse } from './abstractCommand'
import { ConnectionInfoResponse } from './connect'

// Purpose of this is to emit the connect event with the connectionInfo
export class DummyConnectCommand extends AbstractCommandBase<ConnectionInfoResponse> {
	expectedResponseCode = AsynchronousCode.ConnectionInfo

	deserialize (msg: ResponseMessage) {
		const res: ConnectionInfoResponse = {
			protocolVersion: parseFloat(msg.params['protocol version']),
			model: msg.params['model']
		}
		return res
	}
	serialize () {
		// Nothing to send
		return null
	}
}

export class WatchdogPeriodCommand extends AbstractCommandBaseNoResponse {
	readonly Period: number

	constructor (period: number) {
		super()
		this.Period = period
	}

	serialize () {
		const res: NamedMessage = {
			name: 'watchdog',
			params: {
				period: this.Period + ''
			}
		}

		return res
	}
}

export class PingCommand extends AbstractCommandBaseNoResponse {
	serialize () {
		const res: NamedMessage = {
			name: 'ping',
			params: {}
		}

		return res
	}
}
