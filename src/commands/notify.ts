import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'
import { SetBoolIfDefined } from './util'

export interface NotifyCommandResponse {
    Remote: boolean
    Transport: boolean
    Slot: boolean
    Configuration: boolean
}

export class NotifyGetCommand extends AbstractCommandBase<NotifyCommandResponse> {
    expectedResponseCode = SynchronousCode.Notify

    deserialize (msg: ResponseMessage) {
        if (msg.Code === this.expectedResponseCode) {
            this.resolve({
                Remote: msg.Params['remote'] === 'true',
                Transport: msg.Params['transport'] === 'true',
                Slot: msg.Params['slot'] === 'true',
                Configuration: msg.Params['configuration'] === 'true',
            })
        } else { 
            this.reject(msg)
        }
    }
    serialize () {
        const res: NamedMessage = {
            Name: 'notify',
            Params: {}
        }

        return res
    }
}

export class NotifySetCommand extends AbstractCommandBase<boolean> {
    expectedResponseCode = SynchronousCode.OK

    Remote: boolean | undefined
    Transport: boolean | undefined
    Slot: boolean | undefined
    Configuration: boolean | undefined

    deserialize (msg: ResponseMessage) {
        if (msg.Code === this.expectedResponseCode) {
            this.resolve(true)
        } else { 
            this.reject(msg)
        }
    }
    serialize () {
        const res: NamedMessage = {
            Name: 'notify',
            Params: {}
        }

        SetBoolIfDefined(res, 'remote', this.Remote)
        SetBoolIfDefined(res, 'transport', this.Transport)
        SetBoolIfDefined(res, 'slot', this.Slot)
        SetBoolIfDefined(res, 'configuration', this.Configuration)

        return res
    }
}