import { ResponseMessage } from '../message'
import { parseBool } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface RemoteInfoChangeResponse {
	enabled?: boolean
}

export class RemoteInfoChange implements IHandler {
	responseCode = AsynchronousCode.RemoteInfo
	eventName = 'notify.remote'

	deserialize(msg: ResponseMessage): RemoteInfoChangeResponse {
		const res: RemoteInfoChangeResponse = {
			enabled: parseBool(msg.params['enabled']),
		}
		return res
	}
}
