import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { parseBool } from '../util'
import { AbstractCommand } from './abstractCommand'

export interface RemoteInfoCommandResponse {
	enabled?: boolean
	override?: boolean
}

export class RemoteCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.RemoteInfo

	enable?: boolean

	constructor(enable?: boolean) {
		super()

		this.enable = enable
	}

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

		if (this.enable !== undefined) res.params.enable = this.enable ? 'true' : 'false'

		return res
	}
}
