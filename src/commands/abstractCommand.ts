import { ResponseCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'

export interface ErrorResponse extends ResponseMessage {
}

export interface AbstractCommand {
    expectedResponseCode: ResponseCode | null

    deserialize(msg: ResponseMessage)
    serialize(): NamedMessage | null

    markSent()
}

export abstract class AbstractCommandBase<T> implements Promise<T>, AbstractCommand {
    abstract expectedResponseCode: ResponseCode | null

    abstract deserialize(msg: ResponseMessage)
    abstract serialize(): NamedMessage | null

    private _promise: Promise<T>
    protected resolve: (res: T) => void
    protected reject: (res: ErrorResponse) => void

    constructor() {
        // TODO - can this be done any cleaner?
        this._promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
        return this._promise.then(onfulfilled, onrejected)
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
        return this._promise.catch(onrejected)
    }

    [Symbol.toStringTag] // TODO what is this??

    markSent() {
        // TODO - track time sent
    }
}

// export abstract class AbstractCommandBaseNoResponse extends AbstractCommandBase<boolean>{ // TODO - is this type actually needed??
//     expectedResponseCode = null

//     markSent() {
//         super.markSent()
//         // No response will be received, so resolve the promise now
//         this.resolve(true)
//     }

//     deserialize(msg: ResponseMessage){
//         msg.Name
//     }
// }
