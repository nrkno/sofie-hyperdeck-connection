import { NamedMessage } from '../message'
import { AbstractCommandBaseNoResponse } from './abstractCommand'

export class StopCommand extends AbstractCommandBaseNoResponse {
	serialize () {
		const res: NamedMessage = {
			Name: 'stop',
			Params: {}
		}

		return res
	}
}
