import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class RecordCommand extends AbstractCommandNoResponse {
	filename?: string
	append?: boolean

	constructor (filename?: string, append?: boolean) {
		super()

		this.filename = filename
		this.append = append
	}

	serialize () {
		const res: NamedMessage = {
			name: 'record',
			params: {}
		}

		if (this.filename) res.params.name = this.filename
		if (this.append !== undefined) res.params.append = this.append ? 'true' : 'false'

		return res
	}
}
