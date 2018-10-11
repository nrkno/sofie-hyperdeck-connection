import { NamedMessage } from '../message'
import { AbstractCommandBaseNoResponse } from './abstractCommand'

export class RecordCommand extends AbstractCommandBaseNoResponse {
	Filename: string | undefined

	serialize () {
		const res: NamedMessage = {
			Name: 'record',
			Params: {}
		}

		if (this.Filename) res.Params.name = this.Filename

		return res
	}
}
