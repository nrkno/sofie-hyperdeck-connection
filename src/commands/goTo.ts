import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class GoToCommand extends AbstractCommandNoResponse {
	constructor(
		public clip?: string,
		public clipId?: string | number, // Relative offsets, start and end are allowed
		public timecode?: string,
		public timeline?: number
	) {
		super()
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'goto',
			params: {},
		}

		if (this.clip !== undefined) res.params.clip = this.clip
		if (this.clipId !== undefined) res.params['clip id'] = this.clipId + ''
		if (this.timeline !== undefined) res.params.timeline = this.timeline + ''
		if (this.timecode !== undefined) res.params.timecode = this.timecode

		if (Object.keys(res.params).length === 0) {
			throw new Error('GoToCommand needs at least one parameter')
		} else if (Object.keys(res.params).length > 1) {
			throw new Error('GoToCommand should have at most one parameter')
		}

		return res
	}
}
