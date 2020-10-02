import { SynchronousCode } from '../codes'
import { SlotId } from '../enums'
import { NamedMessage, ResponseMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface Clip {
	clipId: string,
	name: string
}

export interface DiskListCommandResponse {
	slotId: SlotId
	clips: Clip[]
}

export class DiskListCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.DiskList
	slot?: string

	constructor (slot?: string) {
		super()

		this.slot = slot
	}

	deserialize (msg: ResponseMessage) {
		const clipIds = Object.keys(msg.params).filter(x => x !== 'slot id')
		const clips = clipIds.map(x => {
			const clip: Clip = {
				clipId: x,
				name: msg.params[x]
			}

			return clip
		})

		const res: DiskListCommandResponse = {
			slotId: parseInt(msg.params['slot id'], 10),
			clips
		}

		return res
	}

	serialize (): NamedMessage | null {
		const res: NamedMessage = {
			name: 'disk list',
			params: {}
		}

		if (this.slot !== undefined) res.params['slot id'] = this.slot

		return res
	}
}
