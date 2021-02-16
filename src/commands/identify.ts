import { AbstractCommandNoResponse } from './abstractCommand'
import { NamedMessage } from '../message'

export class FormatConfirmCommand extends AbstractCommandNoResponse {
	constructor(public enable: boolean) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'identify',
			params: {},
		}

		if (this.enable) {
			res.params['enable'] = this.enable.toString()
		}

		return res
	}
}
