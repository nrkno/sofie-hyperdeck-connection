import { TransportStatus, SlotId, VideoFormat } from '../enums'
import { ResponseMessage } from '../message'
import { parseIdOrNone, parseIntIfDefined, parseBool } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface TransportInfoChangeResponse {
	Status?: TransportStatus
	Speed?: number
	SlotId?: SlotId | null
	ClipId?: number | null
	SingleClip?: boolean
	DisplayTimecode?: string
	Timecode?: string
	VideoFormat?: VideoFormat
	Loop?: boolean
}

export class TransportInfoChange implements IHandler {
	responseCode = AsynchronousCode.TransportInfo
	eventName = 'notify.transport'

	deserialize (msg: ResponseMessage) {
		const res: TransportInfoChangeResponse = {
			Status: msg.Params['status'] as TransportStatus,
			Speed: parseIntIfDefined(msg.Params['speed']),
			SlotId: parseIdOrNone(msg.Params['slot id']),
			ClipId: parseIdOrNone(msg.Params['clip id']),
			SingleClip: parseBool(msg.Params['single clip']),
			DisplayTimecode: msg.Params['display timecode'],
			Timecode: msg.Params['timecode'],
			VideoFormat: msg.Params['video format'] as VideoFormat,
			Loop: parseBool(msg.Params['loop'])
		}
		return res
	}
}
