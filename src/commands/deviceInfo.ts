import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface DeviceInfoCommandResponse {
	protocolVersion: number
	model: string
	uniqueId: string
}

export class DeviceInfoCommand extends AbstractCommand<DeviceInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.DeviceInfo

	deserialize (msg: ResponseMessage) {
		const res: DeviceInfoCommandResponse = {
			protocolVersion: parseFloat(msg.params['protocol version']),
			model: msg.params['model'],
			uniqueId: msg.params['unique id']
		}
		return res
	}
	serialize () {
		const res: NamedMessage = {
			name: 'device info',
			params: {}
		}

		return res
	}
}
