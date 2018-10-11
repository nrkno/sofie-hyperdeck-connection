import { SynchronousCode } from '../codes'
import { SlotId, VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'
import { parseIntIfDefined } from './util'

export interface SlotInfoCommandResponse {
	SlotId: SlotId
	Status: SlotStatus
	VolumeName: string
	RecordingTime: number
	VideoFormat: VideoFormat
}

export class SlotInfoCommand extends AbstractCommandBase<SlotInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.SlotInfo

	deserialize (msg: ResponseMessage) {
		const res: SlotInfoCommandResponse = {
			SlotId: parseInt(msg.Params['slot id'], 10),
			Status: msg.Params['status'] as SlotStatus,
			VolumeName: msg.Params['volume name'],
			RecordingTime: parseInt(msg.Params['recording time'], 10),
			VideoFormat: msg.Params['video format'] as VideoFormat
		}
		return res
	}
	serialize () {
		const res: NamedMessage = {
			Name: 'slot info',
			Params: {}
		}

		return res
	}
}

export interface SlotInfoChangeResponse {
	SlotId: SlotId
	Status?: SlotStatus
	VolumeName?: string
	RecordingTime?: number
	VideoFormat?: VideoFormat
}

export class SlotInfoChange {

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
