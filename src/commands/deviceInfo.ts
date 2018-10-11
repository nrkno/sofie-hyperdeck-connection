import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'

export interface DeviceInfoCommandResponse {
	ProtocolVersion: number
	Model: string
	UniqueId: string
}

export class DeviceInfoCommand extends AbstractCommandBase<DeviceInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.DeviceInfo

	deserialize (msg: ResponseMessage) {
	const res: DeviceInfoCommandResponse = {
	ProtocolVersion: parseFloat(msg.Params['protocol version']),
	Model: msg.Params['model'],
	UniqueId: msg.Params['unique id']
}
	return res
}
	serialize () {
	const res: NamedMessage = {
	Name: 'device info',
	Params: {}
}

	return res
}
}
