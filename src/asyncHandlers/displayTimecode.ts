import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface DisplayTimecodeChangeResponse {
	displayTimecode: string
}

export class DisplayTimecodeChange implements IHandler {
	responseCode = AsynchronousCode.DisplayTimecode
	eventName = 'notify.displayTimecode'

	deserialize(msg: ResponseMessage): DisplayTimecodeChangeResponse {
		const res: DisplayTimecodeChangeResponse = {
			displayTimecode: msg.params['display timecode'],
		}
		return res
	}
}
