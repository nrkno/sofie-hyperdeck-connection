import { AsynchronousCode, SynchronousCode, ErrorCode, ResponseCodeType, GetResponseCodeType } from '../codes'

describe('Codes', () => {
	test('Codes: AsynchronousCode range', async () => {
		for (const v of Object.values(AsynchronousCode).filter((v): v is AsynchronousCode => typeof v === 'number')) {
			expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.ASYNCHRONOUS)
		}
	})

	test('Codes: SynchronousCode range', async () => {
		for (const v of Object.values(SynchronousCode).filter((v): v is SynchronousCode => typeof v === 'number')) {
			expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.SYNCHRONOUS)
		}
	})

	test('Codes: ErrorCode range', async () => {
		for (const v of Object.values(ErrorCode).filter((v): v is ErrorCode => typeof v === 'number')) {
			expect(GetResponseCodeType(v)).toEqual(ResponseCodeType.ERROR)
		}
	})

	test('Codes: ResponseCode range', async () => {
		for (const v of Object.values(ErrorCode).filter((v): v is ErrorCode => typeof v === 'number')) {
			expect(GetResponseCodeType(v)).not.toEqual(ResponseCodeType.UNKNOWN)
		}
	})
})
