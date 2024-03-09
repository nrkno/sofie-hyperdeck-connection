import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommand, AbstractCommandNoResponse } from './abstractCommand'
import { SetBoolIfDefined } from '../util'

export interface NotifyCommandResponse {
	remote: boolean
	transport: boolean
	slot: boolean
	configuration: boolean
	droppedFrames: boolean
	// v1.11 onwards:
	displayTimecode?: boolean
	timelinePosition?: boolean
	playrange?: boolean
	cache?: boolean
	dynamicRange?: boolean
}

export class NotifyGetCommand extends AbstractCommand<NotifyCommandResponse> {
	expectedResponseCode = SynchronousCode.Notify

	deserialize(msg: ResponseMessage): NotifyCommandResponse {
		const res: NotifyCommandResponse = {
			remote: msg.params['remote'] === 'true',
			transport: msg.params['transport'] === 'true',
			slot: msg.params['slot'] === 'true',
			configuration: msg.params['configuration'] === 'true',
			droppedFrames: msg.params['dropped frames'] === 'true',
		}

		if (msg.params['display timecode']) res.displayTimecode = msg.params['display timecode'] === 'true'
		if (msg.params['timeline position']) res.timelinePosition = msg.params['timeline position'] === 'true'
		if (msg.params['playrange']) res.playrange = msg.params['playrange'] === 'true'
		if (msg.params['cache']) res.cache = msg.params['cache'] === 'true'
		if (msg.params['dynamic range']) res.dynamicRange = msg.params['dynamic range'] === 'true'

		return res
	}
	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'notify',
			params: {},
		}

		return res
	}
}

export class NotifySetCommand extends AbstractCommandNoResponse {
	remote?: boolean
	transport?: boolean
	slot?: boolean
	configuration?: boolean
	droppedFrames?: boolean
	// v1.11 onwards
	displayTimecode?: boolean
	timelinePosition?: boolean
	playrange?: boolean
	cache?: boolean
	dynamicRange?: boolean

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'notify',
			params: {},
		}

		SetBoolIfDefined(res, 'remote', this.remote)
		SetBoolIfDefined(res, 'transport', this.transport)
		SetBoolIfDefined(res, 'slot', this.slot)
		SetBoolIfDefined(res, 'configuration', this.configuration)
		SetBoolIfDefined(res, 'dropped frames', this.droppedFrames)

		SetBoolIfDefined(res, 'display timecode', this.displayTimecode)
		SetBoolIfDefined(res, 'timeline position', this.timelinePosition)
		SetBoolIfDefined(res, 'playrange', this.playrange)
		SetBoolIfDefined(res, 'cache', this.cache)
		SetBoolIfDefined(res, 'dynamic range', this.dynamicRange)

		return res
	}
}
