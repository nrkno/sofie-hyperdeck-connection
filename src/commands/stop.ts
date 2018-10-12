import { NamedMessage } from '../message'
import { AbstractCommandBaseNoResponse } from './abstractCommand'

export class StopCommand extends AbstractCommandBaseNoResponse {
	serialize () {
		const res: NamedMessage = {
			name: 'stop',
			params: {}
		}

		return res
	}
}
