import { NamedMessage } from '../message'
import { AbstractCommandNoResponse } from './abstractCommand'

export class SpeedCommand extends AbstractCommandNoResponse {
	speed?: number

	constructor (speed?: number) {
		super()

		this.speed = speed
	}

	serialize () {
		const res: NamedMessage = {
			name: 'speed',
			params: {}
		}

		if (this.speed) res.params.speed = this.speed + ''

		return res
	}
}
