import { ResponseMessage } from '../message'
import { IHandler } from './iHandler'
import { AsynchronousCode } from '../codes'

export interface ConfigurationChangeResponse {
	audioInput?: 'embedded' | 'XLR' | 'RCA',
	videoInput?: 'SDI' | 'HDMI' | 'component' | string,
	fileFormat?: string,
}

export class ConfigurationChange implements IHandler {
	responseCode = AsynchronousCode.Configuration
	eventName = 'notify.configuration'

	deserialize(msg: ResponseMessage): ConfigurationChangeResponse {
		const res: ConfigurationChangeResponse = {
			audioInput: msg.params['audio input'] as ConfigurationChangeResponse['audioInput'],
			videoInput: msg.params['video input'] as ConfigurationChangeResponse['videoInput'],
			fileFormat: msg.params['file format'] as ConfigurationChangeResponse['fileFormat'],
		}
		return res
	}
}
