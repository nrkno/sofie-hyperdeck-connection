import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'

export interface ConfigurationCommandResponse {
	videoInput: string
	audioInput: string
	fileFormat: string
	// v1.11:
	audioCodec?: 'PCM' | 'AAC'
	timecodeInput?: 'external' | 'embedded' | 'preset' | 'clip'
	timecodePreset?: string
	audioInputChannels?: number
	recordTrigger?: 'none' | 'recordbit' | 'timecoderun'
	recordPrefix?: string
	appendTimestamp?: boolean
}

export class ConfigurationGetCommand extends AbstractCommand {
	expectedResponseCode = SynchronousCode.DeviceInfo

	deserialize(msg: ResponseMessage): ConfigurationCommandResponse {
		const res: ConfigurationCommandResponse = {
			videoInput: msg.params['video input'],
			audioInput: msg.params['audio input'],
			fileFormat: msg.params['file format'],
			// v1.11 optional props:
			audioCodec: msg.params['audio codec'] as ConfigurationCommandResponse['audioCodec'],
			timecodeInput: msg.params['timecode input'] as ConfigurationCommandResponse['timecodeInput'],
			timecodePreset: msg.params['timecode preset'] as ConfigurationCommandResponse['timecodePreset'],
			audioInputChannels: msg.params['audio input'] ? parseInt(msg.params['audio input channels']) : undefined,
			recordTrigger: msg.params['record trigger'] as ConfigurationCommandResponse['recordTrigger'],
			recordPrefix: msg.params['record prefix'] as ConfigurationCommandResponse['recordPrefix'],
			appendTimestamp: msg.params['append timestamp'] ? msg.params['append timestamp'] === 'true' : undefined,
		}
		return res
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'configuration',
			params: {},
		}

		return res
	}
}

export class ConfigurationCommand extends AbstractCommandNoResponse {
	constructor(
		public videoInput?: string,
		public audioInput?: string,
		public fileFormat?: string,
		public audioCodec?: 'PCM' | 'AAC',
		public timecodeInput?: 'external' | 'embedded' | 'preset' | 'clip',
		public timecodePreset?: string,
		public audioInputChannels?: number,
		public recordTrigger?: 'none' | 'recordbit' | 'timecoderun',
		public recordPrefix?: string,
		public appendTimestamp?: boolean
	) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'configuration',
			params: {},
		}

		if (this.videoInput) res.params['video input'] = this.videoInput
		if (this.audioInput) res.params['audio input'] = this.audioInput
		if (this.fileFormat) res.params['file format'] = this.fileFormat
		if (this.audioCodec) res.params['audio codec'] = this.audioCodec
		if (this.timecodeInput) res.params['timecode input'] = this.timecodeInput
		if (this.timecodePreset) res.params['timecode preset'] = this.timecodePreset
		if (this.audioInputChannels) res.params['audio input channels'] = this.audioInputChannels + ''
		if (this.recordTrigger) res.params['record trigger'] = this.recordTrigger
		if (this.recordPrefix) res.params['record prefix'] = this.recordPrefix
		if (this.appendTimestamp) res.params['append timestamp'] = this.appendTimestamp ? 'true' : 'false'

		return res
	}
}
