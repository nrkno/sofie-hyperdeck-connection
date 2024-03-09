import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'
import { ConfigurationChangeResponse } from '../events'

export class ConfigurationChange implements IHandler<'notify.configuration'> {
	responseCode = AsynchronousCode.Configuration
	eventName = 'notify.configuration' as const

	deserialize(msg: ResponseMessage): ConfigurationChangeResponse {
		const res: ConfigurationChangeResponse = {
			audioInput: msg.params['audio input'] as ConfigurationChangeResponse['audioInput'],
			videoInput: msg.params['video input'] as ConfigurationChangeResponse['videoInput'],
			fileFormat: msg.params['file format'] as ConfigurationChangeResponse['fileFormat'],
			// v1.11 optional props:
			audioCodec: msg.params['audio codec'] as ConfigurationChangeResponse['audioCodec'],
			timecodeInput: msg.params['timecode input'] as ConfigurationChangeResponse['timecodeInput'],
			timecodePreset: msg.params['timecode preset'] as ConfigurationChangeResponse['timecodePreset'],
			audioInputChannels: msg.params['audio input channels']
				? parseInt(msg.params['audio input channels'])
				: undefined,
			recordTrigger: msg.params['record trigger'] as ConfigurationChangeResponse['recordTrigger'],
			recordPrefix: msg.params['record prefix'] as ConfigurationChangeResponse['recordPrefix'],
			appendTimestamp: msg.params['append timestamp'] ? msg.params['append timestamp'] === 'true' : undefined,
		}
		return res
	}
}
