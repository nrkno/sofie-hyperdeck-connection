import { ResponseCode, SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'

export type ErrorResponse = ResponseMessage

export abstract class AbstractCommand {
	abstract expectedResponseCode: ResponseCode

	abstract deserialize(msg: ResponseMessage): any
	abstract serialize(): NamedMessage | null
}

export abstract class AbstractCommandNoResponse extends AbstractCommand {
	expectedResponseCode = SynchronousCode.OK

	deserialize(_msg: ResponseMessage): void {
		return
	}
}
