import { SynchronousCode } from '../codes'
import { SlotId } from '../enums'
import { NamedMessage, ResponseMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

const deserializeRegex = /(?<fileName>.+) (?<codec>\w+) (?<format>\w+) (?<timecode>[\d:]+)$/i
const framerateRegex = /\d+(?<scan>[ip])(?<frameRate>\d+)/i
const timecodeRegex = /(?<hours>\d+):(?<minutes>\d+):(?<seconds>\d+):(?<frames>\d+)/i

export interface Clip {
	/** 1, 2, 3, etc */
	clipId: string
	/** ExampleVideo.mov, etc */
	name: string
	/** QuickTimeProRes, etc */
	codec: string
	/** 1080i50, 720p60, etc */
	format: string
	/** hh:mm:ss:ff */
	timecode: string
	/** milliseconds */
	duration: number
}

export interface DiskListCommandResponse {
	slotId: SlotId
	clips: Clip[]
}

export class DiskListCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.DiskList
	slot?: string

	constructor(slot?: string) {
		super()

		this.slot = slot
	}

	deserialize(msg: ResponseMessage): DiskListCommandResponse {
		const clipIds = Object.keys(msg.params).filter((x) => x !== 'slot id')
		const clips = clipIds
			.map((x) => {
				const match = msg.params[x].match(deserializeRegex)
				const frameRateMatch = match?.groups?.format.match(framerateRegex)
				const timecodeMatch = match?.groups?.timecode.match(timecodeRegex)
				if (match?.groups && frameRateMatch?.groups && timecodeMatch?.groups) {
					const interlaced = frameRateMatch.groups.scan.toLowerCase() === 'i'
					const fieldRate = parseInt(frameRateMatch.groups.frameRate, 10)
					const msPerFrame = 1000 / (interlaced ? fieldRate / 2 : fieldRate)
					const hoursMs = parseInt(timecodeMatch.groups.hours, 10) * 60 * 60 * 1000
					const minutesMs = parseInt(timecodeMatch.groups.minutes, 10) * 60 * 1000
					const secondsMs = parseInt(timecodeMatch.groups.seconds, 10) * 1000
					const framesMs = parseInt(timecodeMatch.groups.frames) * msPerFrame
					const clip: Clip = {
						clipId: x,
						name: match.groups.fileName,
						codec: match.groups.codec,
						format: match.groups.format,
						timecode: match.groups.timecode,
						duration: hoursMs + minutesMs + secondsMs + framesMs,
					}

					return clip
				}

				return undefined
			})
			.filter((clip): clip is Clip => Boolean(clip))

		const res: DiskListCommandResponse = {
			slotId: parseInt(msg.params['slot id'], 10),
			clips,
		}

		return res
	}

	serialize(): NamedMessage | null {
		const res: NamedMessage = {
			name: 'disk list',
			params: {},
		}

		if (this.slot !== undefined) res.params['slot id'] = this.slot

		return res
	}
}
