import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class GoToCommand extends AbstractCommandNoResponse {
	clip?: string
	clipId?: number
	timecode?: string

	constructor(clip?: string, clipId?: number, timecode?: string) {
		super()

		this.clip = clip
		this.clipId = clipId
		this.timecode = timecode
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'goto',
			params: {},
		}

		if (this.clip !== undefined) res.params.clip = this.clip
		if (this.clipId !== undefined) res.params['clip id'] = this.clipId + ''
		if (this.timecode !== undefined) res.params.timecode = this.timecode

		if (Object.keys(res.params).length === 0) {
			throw new Error('GoToCommand needs at least one parameter')
		} else if (Object.keys(res.params).length > 1) {
			throw new Error('GoToCommand should have at most one parameter')
		}

		return res
	}
}
