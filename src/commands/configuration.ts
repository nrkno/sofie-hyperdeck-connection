import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand } from './abstractCommand'

export interface ConfigurationCommandResponse {
    videoInput: string
    audioInput: string
    fileFormat: string
}

export class ConfigurationCommand extends AbstractCommand {
    expectedResponseCode = SynchronousCode.DeviceInfo

    videoInput?: string
    audioInput?: string
    fileFormat?: string

	deserialize (msg: ResponseMessage) {
		const res: ConfigurationCommandResponse = {
			videoInput: msg.params['video input'],
            audioInput: msg.params['audio input'],
            fileFormat: msg.params['file format']
		}
		return res
	}

	constructor (videoInput?: string, audioInput?: string, fileFormat?: string) {
		super()

        this.videoInput = videoInput
        this.audioInput = audioInput
        this.fileFormat = fileFormat
	}

	serialize () {
		const res: NamedMessage = {
			name: 'jog',
			params: {}
        }

        if (this.videoInput) res.params.videoInput = this.videoInput
        if (this.audioInput) res.params.audioInput = this.audioInput
        if (this.fileFormat) res.params.fileFormat = this.fileFormat

		return res
	}
}
