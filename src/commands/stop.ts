import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class StopCommand extends AbstractCommandNoResponse {
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'stop',
			params: {},
		}

		return res
	}
}
