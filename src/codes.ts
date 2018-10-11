
export type ResponseCode = ErrorCode | SynchronousCode | AsynchronousCode

export enum ErrorCode {
	SyntaxError = 100,
	UnsupportedParameter = 101,
	InvalidValue = 102,
	Unsupported = 103,
	DiskFull = 104,
	NoDisk = 105,
	DiskError = 106,
	TimelineEmpty = 107,
	InternalError = 108,
	OutOfRange = 109,
	NoInput = 110,
	RemoteControlDisabled = 111,
	ConnectionRejected = 120,
	InvalidState = 150,
	InvalidCodec = 151,
	InvalidFormat = 160,
	InvalidToken = 161,
	FormatNotPrepared = 162
}

export enum SynchronousCode {
	OK = 200,
	DeviceInfo = 204,
	TransportInfo = 208,
	Notify = 209
}

export enum AsynchronousCode {
	ConnectionInfo = 500,
	TransportInfo = 508
}

export enum ResponseCodeType {
	Unknown,
	Error,
	Synchronous,
	Asynchronous
}

export function GetResponseCodeType (val: ResponseCode): ResponseCodeType {
	if (val >= 100 && val <= 199) return ResponseCodeType.Error
	if (val >= 200 && val <= 299) return ResponseCodeType.Synchronous
	if (val >= 500 && val <= 599) return ResponseCodeType.Asynchronous

	return ResponseCodeType.Unknown
}
