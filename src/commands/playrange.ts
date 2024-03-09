import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface PlayrangeCommandResponse {
	timelineIn: string
	timelineOut: string
}

export class PlayrangeGetCommand extends AbstractCommand<PlayrangeCommandResponse> {
	expectedResponseCode = SynchronousCode.Playrange

	deserialize(msg: ResponseMessage): PlayrangeCommandResponse {
		const res: PlayrangeCommandResponse = {
			timelineIn: msg.params['timeline in'],
			timelineOut: msg.params['timeline out'],
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'device info',
			params: {},
		}

		return res
	}
}

export class PlayrangeSetCommand extends AbstractCommandNoResponse {
	clip?: number
	count?: number;
	in?: string
	out?: string
	timelineIn?: number
	timelineOut?: number

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'playrange set',
			params: {},
		}

		if (this.clip) {
			res.params['clip id'] = this.clip.toString()
			if (this.count) res.params['count'] = this.count.toString()
		} else if (this.in && this.out) {
			res.params['in'] = this.in.toString()
			res.params['out'] = this.out.toString()
		} else if (this.timelineIn && this.timelineOut) {
			res.params['timeline in'] = this.timelineIn.toString()
			res.params['timeline out'] = this.timelineOut.toString()
		}

		return res
	}
}

export class PlayrangeClearCommand extends AbstractCommandNoResponse {
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'playrange clear',
			params: {},
		}

		return res
	}
}
