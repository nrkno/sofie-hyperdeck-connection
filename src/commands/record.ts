import { NamedMessage } from '../message'
import { AbstractCommandBaseNoResponse } from './abstractCommand'

export class RecordCommand extends AbstractCommandBaseNoResponse {
	filename?: string

	constructor (filename?: string) {
		super()

		this.filename = filename
	}

	serialize () {
		const res: NamedMessage = {
			name: 'record',
			params: {}
		}

		if (this.filename) res.params.name = this.filename

		return res
	}
}
