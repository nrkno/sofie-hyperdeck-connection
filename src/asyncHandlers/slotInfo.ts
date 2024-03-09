import { VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage } from '../message'
import { parseIntIfDefined } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'
import { SlotInfoChangeResponse } from '../events'

export class SlotInfoChange implements IHandler<'notify.slot'> {
	responseCode = AsynchronousCode.SlotInfo
	eventName = 'notify.slot' as const

	deserialize(msg: ResponseMessage): SlotInfoChangeResponse {
		const res: SlotInfoChangeResponse = {
			slotId: parseInt(msg.params['slot id'], 10),
			status: msg.params['status'] as SlotStatus,
			volumeName: msg.params['volume name'],
			recordingTime: parseIntIfDefined(msg.params['recording time']),
			videoFormat: msg.params['video format'] as VideoFormat,
		}
		return res
	}
}
