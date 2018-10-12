import { SynchronousCode } from '../codes'
import { SlotId, VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'

export interface SlotInfoCommandResponse {
	slotId: SlotId
	status: SlotStatus
	volumeName: string
	recordingTime: number
	videoFormat: VideoFormat
}

export class SlotInfoCommand extends AbstractCommandBase<SlotInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.SlotInfo

	deserialize (msg: ResponseMessage) {
		const res: SlotInfoCommandResponse = {
			slotId: parseInt(msg.params['slot id'], 10),
			status: msg.params['status'] as SlotStatus,
			volumeName: msg.params['volume name'],
			recordingTime: parseInt(msg.params['recording time'], 10),
			videoFormat: msg.params['video format'] as VideoFormat
		}
		return res
	}
	serialize () {
		const res: NamedMessage = {
			name: 'slot info',
			params: {}
		}

		return res
	}
}
