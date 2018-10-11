import { NamedMessage } from '../message'

export function SetBoolIfDefined (msg: NamedMessage, name: string, val: boolean | undefined) {
	if (val !== undefined) {
		msg.Params[name] = val ? 'true' : 'false'
	}
}

export function literal<T> (o: T) { return o }

export function parseIdOrNone (str: string | undefined): number | null | undefined {
	if (str === undefined) return undefined
	if (str === 'none') return null
	return parseInt(str, 10)
}

export function parseIntIfDefined (str: string | undefined): number | undefined {
	if (str === undefined) return undefined
	return parseInt(str, 10)
}

export function parseBool (str: string | undefined): boolean | undefined {
	if (str === undefined) return undefined
	return str === 'true'
}
