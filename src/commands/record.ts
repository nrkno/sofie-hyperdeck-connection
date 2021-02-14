import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class RecordCommand extends AbstractCommandNoResponse {
	// TODO - append looks to be removed in 1.11
	constructor(public filename?: string, public append?: boolean) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'record',
			params: {},
		}

		if (this.filename) res.params.name = this.filename
		if (this.append !== undefined) res.params.append = this.append ? 'true' : 'false'

		return res
	}
}

export class RecordSpillCommand extends AbstractCommandNoResponse {
	constructor(public slot?: number) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'record spill',
			params: {},
		}

		if (this.slot !== undefined) res.params['slot id'] = this.slot + ''

		return res
	}
}
