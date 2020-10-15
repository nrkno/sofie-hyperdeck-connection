import { SlotId, VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage } from '../message'
import { parseIntIfDefined } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface SlotInfoChangeResponse {
	slotId: SlotId
	status?: SlotStatus
	volumeName?: string
	recordingTime?: number
	videoFormat?: VideoFormat
}

export class SlotInfoChange implements IHandler {
	responseCode = AsynchronousCode.SlotInfo
	eventName = 'notify.slot'

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
