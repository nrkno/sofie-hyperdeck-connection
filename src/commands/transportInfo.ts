import { SynchronousCode } from '../codes'
import { TransportStatus, SlotId, VideoFormat } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'
import { parseIdOrNone, parseBool } from '../util'

export interface TransportInfoCommandResponse {
	Status: TransportStatus
	Speed: number
	SlotId: SlotId | null
	ClipId: number | null
	SingleClip: boolean
	DisplayTimecode: string
	Timecode: string
	VideoFormat: VideoFormat
	Loop: boolean
}

export class TransportInfoCommand extends AbstractCommandBase<TransportInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.TransportInfo

	deserialize (msg: ResponseMessage) {
		const res: TransportInfoCommandResponse = {
			Status: msg.Params['status'] as TransportStatus,
			Speed: parseInt(msg.Params['speed'], 10),
			SlotId: parseIdOrNone(msg.Params['slot id']) || null,
			ClipId: parseIdOrNone(msg.Params['clip id']) || null,
			SingleClip: parseBool(msg.Params['single clip']) || false,
			DisplayTimecode: msg.Params['display timecode'],
			Timecode: msg.Params['timecode'],
			VideoFormat: msg.Params['video format'] as VideoFormat,
			Loop: parseBool(msg.Params['loop']) || false
		}
		return res
	}
	serialize () {
		const res: NamedMessage = {
			Name: 'transport info',
			Params: {}
		}

		return res
	}
}
