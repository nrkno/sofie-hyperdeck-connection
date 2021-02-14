import { AbstractCommandNoResponse } from './abstractCommand'
import { NamedMessage } from '../message'
import { VideoFormat } from '../enums'

export class SlotSelectCommand extends AbstractCommandNoResponse {
	slotId?: string
	format?: VideoFormat

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'slot select',
			params: {},
		}

		if (this.slotId) {
			res.params['slot id'] = this.slotId
		}
		if (this.format) {
			res.params['video format'] = this.format
		}

		return res
	}
}
