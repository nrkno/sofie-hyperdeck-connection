import { SynchronousCode } from '../codes'
import { TransportStatus, VideoFormat } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'
import { parseIdOrNone, parseBool, parseStringOrNone } from '../util'

export interface TransportInfoCommandResponse {
	status: TransportStatus
	speed: number
	slotId: number | null
	clipId: number | null
	singleClip: boolean
	displayTimecode: string
	timecode: string
	videoFormat: VideoFormat | null
	loop: boolean
	/** Only for newer models */
	inputVideoFormat: VideoFormat | null
}

export class TransportInfoCommand extends AbstractCommand<TransportInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.TransportInfo

	deserialize(msg: ResponseMessage): TransportInfoCommandResponse {
		const res: TransportInfoCommandResponse = {
			status: msg.params['status'] as TransportStatus,
			speed: parseInt(msg.params['speed'], 10),
			slotId: parseIdOrNone(msg.params['slot id']) || null,
			clipId: parseIdOrNone(msg.params['clip id']) || null,
			singleClip: parseBool(msg.params['single clip']) || false,
			displayTimecode: msg.params['display timecode'],
			timecode: msg.params['timecode'],
			videoFormat: (parseStringOrNone(msg.params['video format']) ?? null) as VideoFormat | null,
			loop: parseBool(msg.params['loop']) || false,
			inputVideoFormat: (parseStringOrNone(msg.params['input video format']) || null) as VideoFormat | null,
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'transport info',
			params: {},
		}

		return res
	}
}
