import * as _ from 'underscore'
import { ResponseMessage, NamedMessage } from './message'

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

export class MultilineParser {
	private _debug: boolean
	private _log: (...args: any[]) => void
	private _linesQueue: string[] = []

	constructor (debug: boolean, log: (...args: any[]) => void) {
		this._debug = debug
		this._log = log
	}

	receivedString (data: string): ResponseMessage[] {
		const res: ResponseMessage[] = []

		// add new lines to processing queue
		const newLines = data.split('\r\n')

		// remove the blank line at the end from the intentionally trailing \r\n
		if (newLines.length > 0 && newLines[newLines.length - 1] === '') newLines.pop()

		this._linesQueue = this._linesQueue.concat(newLines)

		while (this._linesQueue.length > 0) {
			// skip any blank lines
			if (this._linesQueue[0] === '') {
				this._linesQueue.shift()
				continue
			}

			// if the first line has no colon, then it is a single line command
			if (this._linesQueue[0].indexOf(':') === -1) {
				const r = this.parseResponse(this._linesQueue.splice(0, 1))
				if (r) res.push(r)
				continue
			}

			const endLine = this._linesQueue.indexOf('')
			if (endLine === -1) {
				// Not got full response yet
				break
			}

			const lines = this._linesQueue.splice(0, endLine + 1)
			const r = this.parseResponse(lines)
			if (r) res.push(r)
		}

		return res
	}

	parseResponse (lines: string[]): ResponseMessage | null {
		lines = lines.map(l => l.trim())

		const headerMatch = lines[0].match(/^(\d+) (.+?)(:|)$/im)
		if (!headerMatch) {
			if (this._debug) this._log('failed to parse header', lines[0])
			return null
		}

		const code = parseInt(headerMatch[1], 10)
		const msg = headerMatch[2]

		const params: { [key: string]: string } = {}

		for (let i = 1; i < lines.length; i++) {
			const lineMatch = lines[i].match(/^(.*?): (.*)$/im)
			if (!lineMatch) {
				if (this._debug) this._log('failed to parse line', lines[i])
				continue
			}

			params[lineMatch[1]] = lineMatch[2]
		}

		const res: ResponseMessage = {
			Code: code,
			Name: msg,
			Params: params
		}
		return res
	}
}
