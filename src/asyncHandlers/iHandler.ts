import { HyperdeckAsyncEvents } from '../events'
import { AsynchronousCode } from '../codes'
import { ResponseMessage } from '../message'

export interface IHandler<TEvent extends keyof HyperdeckAsyncEvents> {
	responseCode: AsynchronousCode
	eventName: TEvent

	deserialize(msg: ResponseMessage): HyperdeckAsyncEvents[TEvent][0]
}
