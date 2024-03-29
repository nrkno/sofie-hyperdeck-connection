import { AbstractCommandNoResponse, AbstractCommand } from './abstractCommand'
import { NamedMessage, ResponseMessage } from '../message'
import { SynchronousCode } from '../codes'
import { FilesystemFormat } from '../enums'

export interface FormatCommandResponse {
	code: string
}

export class FormatCommand extends AbstractCommand<FormatCommandResponse> {
	expectedResponseCode = SynchronousCode.FormatReady

	filesystem?: FilesystemFormat
	slotId?: number
	name?: string

	deserialize(msg: ResponseMessage): FormatCommandResponse {
		return {
			code: msg.params.code,
		}
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'format',
			params: {},
		}

		if (this.filesystem) {
			res.params['prepare'] = this.filesystem
		}
		if (this.slotId) res.params['slot id'] = this.slotId + ''
		if (this.name) res.params['name'] = this.name

		return res
	}
}

export class FormatConfirmCommand extends AbstractCommandNoResponse {
	code?: string

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'format',
			params: {},
		}

		if (this.code) {
			res.params['confirm'] = this.code
		}

		return res
	}
}
