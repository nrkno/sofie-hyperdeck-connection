import { TransportStatus, SlotId, VideoFormat } from '../enums'
import { ResponseMessage } from '../message'
import { parseIdOrNone, parseIntIfDefined, parseBool } from '../util'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface TransportInfoChangeResponse {
	status?: TransportStatus
	speed?: number
	slotId?: SlotId | null
	clipId?: number | null
	singleClip?: boolean
	displayTimecode?: string
	timecode?: string
	videoFormat?: VideoFormat
	loop?: boolean
}

export class TransportInfoChange implements IHandler {
	responseCode = AsynchronousCode.TransportInfo
	eventName = 'notify.transport'

	deserialize(msg: ResponseMessage): TransportInfoChangeResponse {
		const res: TransportInfoChangeResponse = {
			status: msg.params['status'] as TransportStatus,
			speed: parseIntIfDefined(msg.params['speed']),
			slotId: parseIdOrNone(msg.params['slot id']),
			clipId: parseIdOrNone(msg.params['clip id']),
			singleClip: parseBool(msg.params['single clip']),
			displayTimecode: msg.params['display timecode'],
			timecode: msg.params['timecode'],
			videoFormat: msg.params['video format'] as VideoFormat,
			loop: parseBool(msg.params['loop']),
		}

		if (msg.params['active slot'] && !res.slotId) {
			// this is essentially off-spec but seems to be how BMD have implemented it
			res.slotId = parseIdOrNone(msg.params['active slot'])
		}

		return res
	}
}
