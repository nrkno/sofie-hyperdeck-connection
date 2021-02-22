import { AsynchronousCode } from '../codes'
import { ResponseMessage } from '../message'

export interface IHandler {
	responseCode: AsynchronousCode
	eventName: string

	deserialize(msg: ResponseMessage): any
}
