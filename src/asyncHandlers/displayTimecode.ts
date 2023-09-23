import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'
import { DisplayTimecodeChangeResponse } from '../events'

export class DisplayTimecodeChange implements IHandler<'notify.displayTimecode'> {
	responseCode = AsynchronousCode.DisplayTimecode
	eventName = 'notify.displayTimecode' as const

	deserialize(msg: ResponseMessage): DisplayTimecodeChangeResponse {
		const res: DisplayTimecodeChangeResponse = {
			displayTimecode: msg.params['display timecode'],
		}
		return res
	}
}
