import { AbstractCommandNoResponse, AbstractCommand } from './abstractCommand'
import { NamedMessage, ResponseMessage } from '../message'
import { SynchronousCode } from '../codes'
import { FilesystemFormat } from '../enums'

export interface FormatCommandResponse {
	code: string
}

export class FormatCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.FormatReady

	filesystem?: FilesystemFormat

	deserialize (msg: ResponseMessage): FormatCommandResponse {
		return {
			code: msg.params.code
		}
	}

	serialize () {
		const res: NamedMessage = {
			name: 'format',
			params: {}
		}

		if (this.filesystem) {
			res.params['prepare'] = this.filesystem
		}

		return res
	}
}

export class FormatConfirmCommand extends AbstractCommandNoResponse {
	code?: string

	serialize () {
		const res: NamedMessage = {
			name: 'format',
			params: {}
		}

		if (this.code) {
			res.params['confirm'] = this.code
		}

		return res
	}
}
