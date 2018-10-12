import { ResponseCode } from './codes'

export interface NamedMessage {
	name: string
	params: { [key: string]: string }
}
export interface ResponseMessage extends NamedMessage {
	code: ResponseCode
}
