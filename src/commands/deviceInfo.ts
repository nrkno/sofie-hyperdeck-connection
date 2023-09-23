import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface DeviceInfoCommandResponse {
	protocolVersion: number
	model: string
	slots: string
}

export class DeviceInfoCommand extends AbstractCommand<DeviceInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.DeviceInfo

	deserialize(msg: ResponseMessage): DeviceInfoCommandResponse {
		const res: DeviceInfoCommandResponse = {
			protocolVersion: parseFloat(msg.params['protocol version']),
			model: msg.params['model'],
			slots: msg.params['slot count'],
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'device info',
			params: {},
		}

		return res
	}
}
