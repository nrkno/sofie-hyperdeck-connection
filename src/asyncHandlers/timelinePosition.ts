import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface TimelinePositionChangeResponse {
	timelinePosition: string
}

export class TimelinePositionChange implements IHandler {
	responseCode = AsynchronousCode.TimelinePosition
	eventName = 'notify.timelinePosition'

	deserialize(msg: ResponseMessage): TimelinePositionChangeResponse {
		const res: TimelinePositionChangeResponse = {
			timelinePosition: msg.params['timeline position'],
		}
		return res
	}
}
