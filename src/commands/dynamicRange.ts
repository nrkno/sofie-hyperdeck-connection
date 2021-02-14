import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'
import { DynamicRange } from '../enums'

export interface DynamicRangeCommandResponse {
	playbackOverride: DynamicRange
}

export class DynamicRangeGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.DynamicRange

	deserialize(msg: ResponseMessage): DynamicRangeCommandResponse {
		const res: DynamicRangeCommandResponse = {
			playbackOverride: msg.params['playback override'] as DynamicRange,
		}
		return res
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'dynamic range',
			params: {},
		}

		return res
	}
}

export class DynamicRangeSetCommand extends AbstractCommandNoResponse {
	constructor(public override: DynamicRange) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'dynamic range',
			params: {
				'playback override': this.override,
			},
		}

		return res
	}
}
