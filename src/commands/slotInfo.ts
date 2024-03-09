import { SynchronousCode } from '../codes'
import { VideoFormat, SlotStatus } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface SlotInfoCommandResponse {
	slotId: number
	status: SlotStatus
	volumeName: string
	recordingTime: number
	videoFormat: VideoFormat
}

export class SlotInfoCommand extends AbstractCommand<SlotInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.SlotInfo

	readonly slotId?: number

	constructor(slotId?: number) {
		super()
		this.slotId = slotId
	}

	deserialize(msg: ResponseMessage): SlotInfoCommandResponse {
		const res: SlotInfoCommandResponse = {
			slotId: parseInt(msg.params['slot id'], 10),
			status: msg.params['status'] as SlotStatus,
			volumeName: msg.params['volume name'],
			recordingTime: parseInt(msg.params['recording time'], 10),
			videoFormat: msg.params['video format'] as VideoFormat,
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'slot info',
			params: {},
		}

		if (this.slotId) res.params['slot id'] = this.slotId + ''

		return res
	}
}
