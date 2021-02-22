import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class RemoteCommand extends AbstractCommandNoResponse {
	enable?: boolean

	constructor(enable?: boolean) {
		super()

		this.enable = enable
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'remote',
			params: {},
		}

		if (this.enable !== undefined) res.params.enable = this.enable ? 'true' : 'false'

		return res
	}
}
