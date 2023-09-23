import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'
import { TimelinePositionChangeResponse } from '../events'

export class TimelinePositionChange implements IHandler<'notify.timelinePosition'> {
	responseCode = AsynchronousCode.TimelinePosition
	eventName = 'notify.timelinePosition' as const

	deserialize(msg: ResponseMessage): TimelinePositionChangeResponse {
		const res: TimelinePositionChangeResponse = {
			timelinePosition: msg.params['timeline position'],
		}
		return res
	}
}
