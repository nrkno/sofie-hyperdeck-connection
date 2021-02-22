import { AbstractCommandNoResponse } from './abstractCommand'
import { NamedMessage } from '../message'

export class SlotSelectCommand extends AbstractCommandNoResponse {
	slotId?: string

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'slot select',
			params: {},
		}

		if (this.slotId) {
			res.params['slot id'] = this.slotId
		}

		return res
	}
}
