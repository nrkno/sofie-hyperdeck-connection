import { AsynchronousCode } from '../codes'
import { ResponseMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'

export interface ConnectionInfoResponse {
	ProtocolVersion: number
	Model: string
}

// Purpose of this is to emit the connect event with the connectionInfo
export class DummyConnectCommand extends AbstractCommandBase<ConnectionInfoResponse> {
	expectedResponseCode = AsynchronousCode.ConnectionInfo

	deserialize (msg: ResponseMessage) {
	const res: ConnectionInfoResponse = {
	ProtocolVersion: parseFloat(msg.Params['protocol version']),
	Model: msg.Params['model']
}
	return res
}
	serialize () {
		// Nothing to send
	return null
}
}
