import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { parseBool } from '../util'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface RemoteInfoCommandResponse {
	enabled?: boolean
	override?: boolean
}

export class RemoteGetCommand extends AbstractCommand<RemoteInfoCommandResponse> {
	expectedResponseCode = SynchronousCode.RemoteInfo

	deserialize(msg: ResponseMessage): RemoteInfoCommandResponse {
		const res: RemoteInfoCommandResponse = {
			enabled: parseBool(msg.params['enabled']),
			override: parseBool(msg.params['override']),
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'remote',
			params: {},
		}

		return res
	}
}

export class RemoteCommand extends AbstractCommandNoResponse {
	enable?: boolean

	constructor(enable?: boolean) {
		super()

		this.enable = enable
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'remote',
			params: {},
		}

		if (this.enable !== undefined) res.params.enable = this.enable ? 'true' : 'false'

		return res
	}
}
