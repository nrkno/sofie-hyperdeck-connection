import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface ConfigurationCommandResponse {
	videoInput: string
	audioInput: string
	fileFormat: string
}

export class ConfigurationGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.DeviceInfo

	deserialize (msg: ResponseMessage) {
		const res: ConfigurationCommandResponse = {
			videoInput: msg.params['video input'],
			audioInput: msg.params['audio input'],
			fileFormat: msg.params['file format']
		}
		return res
	}

	serialize () {
		const res: NamedMessage = {
			name: 'configuration',
			params: {}
		}

		return res
	}
}

export class ConfigurationCommand extends AbstractCommandNoResponse {
	videoInput?: string
	audioInput?: string
	fileFormat?: string

	constructor (videoInput?: string, audioInput?: string, fileFormat?: string) {
		super()

		this.videoInput = videoInput
		this.audioInput = audioInput
		this.fileFormat = fileFormat
	}

	serialize () {
		const res: NamedMessage = {
			name: 'configuration',
			params: {}
		}

		if (this.videoInput) res.params.videoInput = this.videoInput
		if (this.audioInput) res.params.audioInput = this.audioInput
		if (this.fileFormat) res.params.fileFormat = this.fileFormat

		return res
	}
}
