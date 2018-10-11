import { ResponseCode, SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'

export interface ErrorResponse extends ResponseMessage {
}

// export interface IResponse {
// }

export interface AbstractCommand {
	expectedResponseCode: ResponseCode

	handle (msg: ResponseMessage)

	// deserialize(msg: ResponseMessage): IResponse
	serialize (): NamedMessage | null

	markSent ()
}

export abstract class AbstractCommandBase<T> implements Promise<T>, AbstractCommand {
	abstract expectedResponseCode: ResponseCode

	[Symbol.toStringTag] // TODO what is this??

	protected resolve: (res: T) => void
	protected reject: (res: ErrorResponse) => void

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

	then<TResult1 = T, TResult2 = never> (onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
		return this._promise.then(onfulfilled, onrejected)
	}

	catch<TResult = never> (onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
		return this._promise.catch(onrejected)
	}

	markSent () {
		// TODO - track time sent
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

	// markSent() {
	//     super.markSent()
	//     // No response will be received, so resolve the promise now
	//     this.resolve(true)
	// }

	deserialize (msg: ResponseMessage) {
		msg.Code.toString()
		return true
	}
}
