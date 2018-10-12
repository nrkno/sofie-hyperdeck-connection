import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class RecordCommand extends AbstractCommandNoResponse {
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
