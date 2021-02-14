import { SynchronousCode } from '../codes'
import { NamedMessage, ResponseMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface PlayOnStartupCommandResponse {
	enable: boolean
	singleClip: boolean
}

export class PlayOnStartupGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.Playrange

	deserialize(msg: ResponseMessage): PlayOnStartupCommandResponse {
		const res: PlayOnStartupCommandResponse = {
			enable: msg.params['enable'] === 'true',
			singleClip: msg.params['single clip'] === 'true',
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'play on startup',
			params: {},
		}

		return res
	}
}

export class PlayOnStartupSetCommand extends AbstractCommandNoResponse {
	enable?: boolean
	singleClip?: boolean

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'playrange set',
			params: {},
		}

		if (this.enable !== false) res.params['enable'] = this.enable + ''
		if (this.singleClip !== false) res.params['single clip'] = this.singleClip + ''

		return res
	}
}
