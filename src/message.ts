import { ResponseCode } from './codes'

export interface NamedMessage {
	Name: string
	Params: { [key: string]: string }
}
export interface ResponseMessage extends NamedMessage {
	Code: ResponseCode
}
