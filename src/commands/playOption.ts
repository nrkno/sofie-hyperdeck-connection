import { SynchronousCode } from '../codes'
import { NamedMessage, ResponseMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface PlayOptionCommandResponse {
	stopMode: 'lastframe' | 'nextframe' | 'black'
}

export class PlayOptionGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.PlayOption

	deserialize(msg: ResponseMessage): PlayOptionCommandResponse {
		const res: PlayOptionCommandResponse = {
			stopMode: msg.params['stop mode'] as PlayOptionCommandResponse['stopMode'],
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'play option',
			params: {},
		}

		return res
	}
}

export class PlayOptionSetCommand extends AbstractCommandNoResponse {
	constructor(public stopMode: 'lastframe' | 'nextframe' | 'black') {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'play option',
			params: {},
		}

		if (this.stopMode !== undefined) res.params['stop mode'] = this.stopMode

		return res
	}
}
