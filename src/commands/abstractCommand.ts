import { ResponseCode, SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'

export type ErrorResponse = ResponseMessage

export abstract class AbstractCommand<TResponse> {
	abstract expectedResponseCode: ResponseCode

	abstract deserialize(msg: ResponseMessage): TResponse
	abstract serialize(): NamedMessage | null
}

export abstract class AbstractCommandNoResponse extends AbstractCommand<void> {
	expectedResponseCode = SynchronousCode.OK

	deserialize(_msg: ResponseMessage): void {
		return
	}
}
