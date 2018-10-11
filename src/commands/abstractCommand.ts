import { ResponseCode, SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'

export interface ErrorResponse extends ResponseMessage {
}

export interface AbstractCommand {
	expectedResponseCode: ResponseCode

	handle (msg: ResponseMessage)

	serialize (): NamedMessage | null
}

export abstract class AbstractCommandBase<T> implements Promise<T>, AbstractCommand {
	abstract expectedResponseCode: ResponseCode

	[Symbol.toStringTag] // TODO what is this??

	private resolve: (res: T) => void
	private reject: (res: ErrorResponse) => void
	private _promise: Promise<T>

	constructor () {
		// TODO - can this be done any cleaner?
		this._promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}

	abstract deserialize (msg: ResponseMessage): T
	abstract serialize (): NamedMessage | null

	async then<TResult1 = T, TResult2 = never> (onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
		return this._promise.then(onfulfilled, onrejected)
	}
	async catch<TResult = never> (onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
		return this._promise.catch(onrejected)
	}

	handle (msg: ResponseMessage) {
		if (msg.Code === this.expectedResponseCode) {
			this.resolve(this.deserialize(msg))
		} else {
			this.reject(msg)
		}
	}
}

export abstract class AbstractCommandBaseNoResponse extends AbstractCommandBase<boolean> {
	expectedResponseCode = SynchronousCode.OK

	deserialize (msg: ResponseMessage) {
		msg.Code.toString()
		return true
	}
}
