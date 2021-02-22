import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'
import { SetBoolIfDefined } from '../util'

export interface NotifyCommandResponse {
	remote: boolean
	transport: boolean
	slot: boolean
	configuration: boolean
	droppedFrames: boolean
}

export class NotifyGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.Notify

	deserialize(msg: ResponseMessage): NotifyCommandResponse {
		const res: NotifyCommandResponse = {
			remote: msg.params['remote'] === 'true',
			transport: msg.params['transport'] === 'true',
			slot: msg.params['slot'] === 'true',
			configuration: msg.params['configuration'] === 'true',
			droppedFrames: msg.params['dropped frames'] === 'true',
		}
		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'notify',
			params: {},
		}

		return res
	}
}

export class NotifySetCommand extends AbstractCommandNoResponse {
	remote?: boolean
	transport?: boolean
	slot?: boolean
	configuration?: boolean
	droppedFrames?: boolean

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'notify',
			params: {},
		}

		SetBoolIfDefined(res, 'remote', this.remote)
		SetBoolIfDefined(res, 'transport', this.transport)
		SetBoolIfDefined(res, 'slot', this.slot)
		SetBoolIfDefined(res, 'configuration', this.configuration)
		SetBoolIfDefined(res, 'dropped frames', this.droppedFrames)

		return res
	}
}
