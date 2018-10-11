import { NamedMessage } from '../message'

export function SetBoolIfDefined(msg: NamedMessage, name: string, val: boolean | undefined) {
    if (val !== undefined) {
        msg.Params[name] = val ? 'true' : 'false'
    }
}

export function literal<T> (o: T) { return o }