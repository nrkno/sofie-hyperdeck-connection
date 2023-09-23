import { ConnectionInfoResponse } from './commands/connect'
import { SlotId, SlotStatus, TransportStatus, VideoFormat } from './enums'

export interface HyperdeckEvents extends HyperdeckAsyncEvents {
	error: [message: string, error: Error | unknown]
	disconnected: []
	connected: [info: ConnectionInfoResponse]
}

export interface HyperdeckAsyncEvents {
	'notify.displayTimecode': [DisplayTimecodeChangeResponse]
	'notify.configuration': [ConfigurationChangeResponse]
	'notify.transport': [TransportInfoChangeResponse]
	'notify.timelinePosition': [TimelinePositionChangeResponse]
	'notify.slot': [SlotInfoChangeResponse]
	'notify.remote': [RemoteInfoChangeResponse]
}

export interface DisplayTimecodeChangeResponse {
	displayTimecode: string
}

export interface ConfigurationChangeResponse {
	audioInput?: 'embedded' | 'XLR' | 'RCA'
	videoInput?: 'SDI' | 'HDMI' | 'component' | string
	fileFormat?: string
	// v1.11:
	audioCodec?: 'PCM' | 'AAC'
	timecodeInput?: 'external' | 'embedded' | 'preset' | 'clip'
	timecodePreset?: string
	audioInputChannels?: number
	recordTrigger?: 'none' | 'recordbit' | 'timecoderun'
	recordPrefix?: string
	appendTimestamp?: boolean
}

export interface TransportInfoChangeResponse {
	status?: TransportStatus
	speed?: number
	slotId?: SlotId | null
	clipId?: number | null
	singleClip?: boolean
	displayTimecode?: string
	timecode?: string
	videoFormat?: VideoFormat
	loop?: boolean
}

export interface TimelinePositionChangeResponse {
	timelinePosition: string
}

export interface SlotInfoChangeResponse {
	slotId: SlotId
	status?: SlotStatus
	volumeName?: string
	recordingTime?: number
	videoFormat?: VideoFormat
}

export interface RemoteInfoChangeResponse {
	enabled?: boolean
}
