import { AsynchronousCode, SynchronousCode, ErrorCode, ResponseCodeType, GetResponseCodeType } from '../codes'

describe('Codes', () => {
	test('Codes: AsynchronousCode range', async () => {
		for (const item in AsynchronousCode) {
			const v = Number(item)
			if (!isNaN(v)) {
				expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.ASYNCHRONOUS)
			}
		}
	})

	test('Codes: SynchronousCode range', async () => {
		for (const item in SynchronousCode) {
			const v = Number(item)
			if (!isNaN(v)) {
				expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.SYNCHRONOUS)
			}
		}
	})

	test('Codes: ErrorCode range', async () => {
		for (const item in ErrorCode) {
			const v = Number(item)
			if (!isNaN(v)) {
				expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.ERROR)
			}
		}
	})

	test('Codes: ResponseCode range', async () => {
		for (const item in ErrorCode) {
			const v = Number(item)
			if (!isNaN(v)) {
				expect(GetResponseCodeType(v)).not.toEqual(ResponseCodeType.UNKNOWN)
			}
		}
	})
})
