import { SynchronousCode } from '../codes'
import { TransportStatus, SlotId, VideoFormat } from '../enums'
import { ResponseMessage, NamedMessage } from '../message'
import { AbstractCommandBase } from './abstractCommand'
import { parseIdOrNone, parseIntIfDefined, parseBool } from './util'

export interface TransportInfoCommandResponse {
    Status: TransportStatus
    Speed: number
    SlotId: SlotId | null
    ClipId: number | null
    SingleClip: boolean
    DisplayTimecode: string
    Timecode: string
    VideoFormat: VideoFormat
    Loop: boolean
}

export class TransportInfoCommand extends AbstractCommandBase<TransportInfoCommandResponse> {
    expectedResponseCode = SynchronousCode.TransportInfo

    deserialize (msg: ResponseMessage) {
        const res: TransportInfoCommandResponse = {
            Status: msg.Params['status'] as TransportStatus,
            Speed: parseInt(msg.Params['speed']),
            SlotId: parseIdOrNone(msg.Params['slot id']) || null,
            ClipId: parseIdOrNone(msg.Params['clip id']) || null,
            SingleClip: parseBool(msg.Params['single clip']) || false,
            DisplayTimecode: msg.Params['display timecode'],
            Timecode: msg.Params['timecode'],
            VideoFormat: msg.Params['video format'] as VideoFormat,
            Loop: parseBool(msg.Params['loop']) || false,
        }
        return res
    }
    serialize () {
        const res: NamedMessage = {
            Name: 'transport info',
            Params: {}
        }

        return res
    }
}

export interface TransportInfoChangeResponse {
    Status: TransportStatus | undefined
    Speed: number | undefined
    SlotId: SlotId | null | undefined
    ClipId: number | null | undefined
    SingleClip: boolean | undefined
    DisplayTimecode: string | undefined
    Timecode: string | undefined
    VideoFormat: VideoFormat | undefined
    Loop: boolean | undefined
}

export class TransportInfoChange {
    
    deserialize (msg: ResponseMessage) {
        const res: TransportInfoChangeResponse = {
            Status: msg.Params['status'] as TransportStatus,
            Speed: parseIntIfDefined(msg.Params['speed']),
            SlotId: parseIdOrNone(msg.Params['slot id']),
            ClipId: parseIdOrNone(msg.Params['clip id']),
            SingleClip: parseBool(msg.Params['single clip']),
            DisplayTimecode: msg.Params['display timecode'],
            Timecode: msg.Params['timecode'],
            VideoFormat: msg.Params['video format'] as VideoFormat,
            Loop: parseBool(msg.Params['loop']),
        }
        return res
    }
}
