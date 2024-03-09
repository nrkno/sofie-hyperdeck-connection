import { SynchronousCode } from '../codes'
import { NamedMessage, ResponseMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface ClipInfo {
	clipId: number
	name: string
	startTime: string
	duration: string
	in?: string
	out?: string
}
export interface ClipsGetCommandResponse {
	clipCount: number
	clips: ClipInfo[]
}
export interface ClipsCountCommandResponse {
	count: number
}

export class ClipsGetCommand extends AbstractCommand<ClipsGetCommandResponse> {
	expectedResponseCode = SynchronousCode.ClipsGet

	constructor(public clip?: number, public count?: number, public readonly version?: 1 | 2) {
		super()
	}

	deserialize(msg: ResponseMessage): ClipsGetCommandResponse {
		const clipIds = Object.keys(msg.params).filter((x) => x !== 'clip count')
		const clips = clipIds.map<ClipInfo>((x) => {
			if (this.version === 2) {
				return {
					clipId: Number(x),
					name: msg.params[x].substr(48),
					startTime: msg.params[x].substr(0, 11),
					duration: msg.params[x].substr(12, 11),
					in: msg.params[x].substr(24, 11),
					out: msg.params[x].substr(35, 11),
				}
			} else {
				// v1
				return {
					clipId: Number(x),
					name: msg.params[x].slice(0, -24),
					startTime: msg.params[x].substr(-23, 11),
					duration: msg.params[x].substr(-11, 11),
				}
			}
		})

		const res: ClipsGetCommandResponse = {
			clipCount: parseInt(msg.params['clip count'], 10),
			clips,
		}

		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'clips get',
			params: {},
		}

		if (this.clip !== undefined) res.params['clip id'] = this.clip + ''
		if (this.count !== undefined) res.params['count'] = this.count + ''
		if (this.version !== undefined) res.params['version'] = this.version + ''

		return res
	}
}

export class ClipsCountCommand extends AbstractCommand<ClipsCountCommandResponse> {
	expectedResponseCode = SynchronousCode.ClipsCount

	deserialize(msg: ResponseMessage): ClipsCountCommandResponse {
		const res: ClipsCountCommandResponse = {
			count: parseInt(msg.params['clip count'], 10),
		}

		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'clips count',
			params: {},
		}

		return res
	}
}

export class ClipsAddCommand extends AbstractCommandNoResponse {
	constructor(public name: string, public clip?: string, public inPoint?: string, public outPoint?: string) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'clips add',
			params: {
				name: this.name,
			},
		}

		if (this.clip) res.params['clip'] = this.clip
		if (this.inPoint) res.params['inPoint'] = this.inPoint
		if (this.outPoint) res.params['outPoint'] = this.outPoint

		return res
	}
}

export class ClipsClearCommand extends AbstractCommandNoResponse {
	constructor() {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'clips clear',
			params: {},
		}

		return res
	}
}
