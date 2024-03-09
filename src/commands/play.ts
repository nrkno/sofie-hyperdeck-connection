import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class PlayCommand extends AbstractCommandNoResponse {
	speed?: string
	loop?: boolean
	singleClip?: boolean

	constructor(speed?: string, loop?: boolean, singleClip?: boolean) {
		super()

		this.speed = speed
		this.loop = loop
		this.singleClip = singleClip
	}

	serialize(): NamedMessage {
		const res: NamedMessage = {
			name: 'play',
			params: {},
		}

		if (this.speed !== undefined) res.params.speed = this.speed
		if (this.loop !== undefined) res.params.loop = this.loop ? 'true' : 'false'
		if (this.singleClip !== undefined) res.params['single clip'] = this.singleClip ? 'true' : 'false'

		return res
	}
}
