import { SynchronousCode } from '../codes'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase, AbstractCommandBaseNoResponse } from './abstractCommand'
import { SetBoolIfDefined } from './util'

export interface NotifyCommandResponse {
    Remote: boolean
    Transport: boolean
    Slot: boolean
    Configuration: boolean
    DroppedFrames: boolean
}

export class NotifyGetCommand extends AbstractCommandBase<NotifyCommandResponse> {
    expectedResponseCode = SynchronousCode.Notify

    deserialize (msg: ResponseMessage) {
        const res: NotifyCommandResponse = {
            Remote: msg.Params['remote'] === 'true',
            Transport: msg.Params['transport'] === 'true',
            Slot: msg.Params['slot'] === 'true',
            Configuration: msg.Params['configuration'] === 'true',
            DroppedFrames: msg.Params['dropped frames'] === 'true',
        }
        return res
    }
    serialize () {
        const res: NamedMessage = {
            Name: 'notify',
            Params: {}
        }

        return res
    }
}

export class NotifySetCommand extends AbstractCommandBaseNoResponse {
    Remote: boolean | undefined
    Transport: boolean | undefined
    Slot: boolean | undefined
    Configuration: boolean | undefined
    DroppedFrames: boolean | undefined

    serialize () {
        const res: NamedMessage = {
            Name: 'notify',
            Params: {}
        }

        SetBoolIfDefined(res, 'remote', this.Remote)
        SetBoolIfDefined(res, 'transport', this.Transport)
        SetBoolIfDefined(res, 'slot', this.Slot)
        SetBoolIfDefined(res, 'configuration', this.Configuration)
        SetBoolIfDefined(res, 'dropped frames', this.DroppedFrames)

        return res
    }
}