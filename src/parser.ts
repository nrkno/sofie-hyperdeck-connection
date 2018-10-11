import * as _ from 'underscore'
import { ResponseMessage, NamedMessage } from './message'

export function parseResponse (lines: string[]): ResponseMessage | null {
	if (lines.length === 0) return null

	lines = lines.map(l => l.trim()) // TODO - ensure this is safe with dodgey clip names

	const headerMatch = lines[0].match(/^(\d+) (.+?)(:|)$/im)
	if (!headerMatch) {
		// TODO
		console.log('bad response header')
		return null
	}

	const code = parseInt(headerMatch[1], 10)
	const msg = headerMatch[2]

	const params: { [key: string]: string } = {}

	for (let i = 1; i < lines.length; i++) {
		const lineMatch = lines[i].match(/^(.*?): (.*)$/im)
		if (!lineMatch) continue // TODO fail because of bad line?

		params[lineMatch[1]] = lineMatch[2]
	}

	const res: ResponseMessage = {
		Code: code,
		Name: msg,
		Params: params
	}
	return res
}

export function buildMessageStr (msg: NamedMessage) {
	if (_.isEmpty(msg.Params)) {
		return msg.Name + '\r\n'
	}

	let str = msg.Name + ':\r\n'
	_.forEach(msg.Params, (v, k) => {
		str += k + ': ' + v + '\r\n'
	})

	return str + '\r\n'
}
