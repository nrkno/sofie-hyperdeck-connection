import { ResponseMessage } from '../message'
import { parseBool } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'
import { RemoteInfoChangeResponse } from '../events'

export class RemoteInfoChange implements IHandler<'notify.remote'> {
	responseCode = AsynchronousCode.RemoteInfo
	eventName = 'notify.remote' as const

	deserialize(msg: ResponseMessage): RemoteInfoChangeResponse {
		const res: RemoteInfoChangeResponse = {
			enabled: parseBool(msg.params['enabled']),
		}
		return res
	}
}
