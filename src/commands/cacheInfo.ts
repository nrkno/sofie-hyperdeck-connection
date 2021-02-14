import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface CacheInfoCommandResponse {
	status: string
	transferringSlotId: number
	recordingTime: number
}

export class CacheInfoGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.CacheInfo

	deserialize(msg: ResponseMessage): CacheInfoCommandResponse {
		const res: CacheInfoCommandResponse = {
			status: msg.params['status'],
			transferringSlotId: parseInt(msg.params['transferring slot id']),
			recordingTime: parseInt(msg.params['recording time']),
		}
		return res
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'cache info',
			params: {},
		}

		return res
	}
}
