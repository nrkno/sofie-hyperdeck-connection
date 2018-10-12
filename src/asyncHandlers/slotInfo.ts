import { SlotId, VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage } from '../message'
import { parseIntIfDefined } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface SlotInfoChangeResponse {
	SlotId: SlotId
	Status?: SlotStatus
	VolumeName?: string
	RecordingTime?: number
	VideoFormat?: VideoFormat
}

export class SlotInfoChange implements IHandler {
	responseCode = AsynchronousCode.SlotInfo
	eventName = 'notify.transport'

	deserialize (msg: ResponseMessage) {
		const res: SlotInfoChangeResponse = {
			SlotId: parseInt(msg.Params['slot id'], 10),
			Status: msg.Params['status'] as SlotStatus,
			VolumeName: msg.Params['volume name'],
			RecordingTime: parseIntIfDefined(msg.Params['recording time']),
			VideoFormat: msg.Params['video format'] as VideoFormat
		}
		return res
	}
}
