export enum TransportStatus {
	PREVIEW = 'preview',
	STOPPED = 'stopped',
	PLAY = 'play',
	FORWARD = 'forward',
	REWIND = 'rewind',
	JOG = 'jog',
	SHUTTLE = 'shuttle',
	RECORD = 'record',
}

export enum SlotStatus {
	EMPTY = 'empty',
	MOUNTING = 'mounting',
	ERROR = 'error',
	MOUNTED = 'mounted',
}

export enum VideoFormat {
	NTSC = 'NTSC',
	PAL = 'PAL',
	NTSCp = 'NTSCp',
	PALp = 'PALp',

	_720p50 = '720p50',
	_720p5994 = '720p5994',
	_720p60 = '720p60',
	_1080p23976 = '1080p23976',
	_1080p24 = '1080p24',
	_1080p25 = '1080p25',
	_1080p2997 = '1080p2997',
	_1080p30 = '1080p30',
	_1080i50 = '1080i50',
	_1080i5994 = '1080i5994',
	_1080i60 = '1080i60',

	_1080p50 = '1080p50',
	_1080p5994 = '1080p5994',
	_1080p60 = '1080p60',

	_2Kp23976DCI = '2Kp23976DCI',
	_2Kp24DCI = '2Kp24DCI',
	_2Kp25DCI = '2Kp25DCI',

	_4Kp23976 = '4Kp23976',
	_4Kp24 = '4Kp24',
	_4Kp25 = '4Kp25',
	_4Kp2997 = '4Kp2997',
	_4Kp30 = '4Kp30',

	_4Kp23976DCI = '4Kp23976DCI',
	_4Kp24DCI = '4Kp24DCI',
	_4Kp25DCI = '4Kp25DCI',

	_4Kp50 = '4Kp50',
	_4Kp5994 = '4Kp5994',
	_4Kp60 = '4Kp60',

	// Note: 8K modes are untested
	_8Kp23976 = '8Kp23976',
	_8Kp24 = '8Kp24',
	_8Kp25 = '8Kp25',
	_8Kp2997 = '8Kp2997',
	_8Kp30 = '8Kp30',

	_8Kp23976DCI = '8Kp23976DCI',
	_8Kp24DCI = '8Kp24DCI',
	_8Kp25DCI = '8Kp25DCI',

	_8Kp50 = '8Kp50',
	_8Kp5994 = '8Kp5994',
	_8Kp60 = '8Kp60',
}

export enum FilesystemFormat {
	exFAT = 'exFAT',
	HFS = 'HFS+',
}

export enum DynamicRange {
	Off = 'off',
	Rec709 = 'Rec709',
	Rec2020_SDR = 'Rec2020_SDR',
	HLG = 'HLG',
	ST2084_300 = 'ST2084_300',
	ST2084_500 = 'ST2084_500',
	ST2084_800 = 'ST2084_800',
	ST2084_1000 = 'ST2084_1000',
	ST2084_2000 = 'ST2084_2000',
	ST2084_4000 = 'ST2084_4000',
	ST2048 = 'ST2048',
}
