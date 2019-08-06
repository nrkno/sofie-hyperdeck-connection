import { MultilineParser, buildMessageStr } from '../parser'
import { NamedMessage } from '../message'

describe('Parser', () => {

	test('Parser: response single line', async () => {
		const msg: NamedMessage = {
			name: 'some phrase',
			params: {}
		}

		const str = buildMessageStr(msg)
		expect(str).toEqual('some phrase\r\n')
	})

	test('Parser: response multiline', async () => {
		const msg: NamedMessage = {
			name: 'some phrase',
			params: {
				'item one': 'val 1'
			}
		}

		const str = buildMessageStr(msg)
		expect(str).toEqual('some phrase:\r\nitem one: val 1\r\n\r\n')
	})

	test('Parser: Single line', async () => {
		const rawLines = ['200 ok']

		const parser = new MultilineParser(false, () => null)
		const res = parser.parseResponse(rawLines)
		expect(res).toBeTruthy()

		if (res) {
			expect(res.code).toEqual(200)
			expect(res.name).toEqual('ok')
			expect(res.params).toEqual({})
		}
	})

	test('Parser: Broken line', async () => {
		const rawLines = ['200ok']

		const parser = new MultilineParser(false, () => null)
		const res = parser.parseResponse(rawLines)
		expect(res).toBeFalsy()
	})

	test('Parser: Multiline', async () => {
		const rawLines = [
			'200 spaced name:',
			'prop1: val',
			'item2: val2',
			'spaced key: spaced out val',
			'broken line to be ignored'
		]

		const parser = new MultilineParser(false, () => null)
		const res = parser.parseResponse(rawLines)
		expect(res).toBeTruthy()

		if (res) {
			expect(res.code).toEqual(200)
			expect(res.name).toEqual('spaced name')
			expect(res.params).toEqual({
				prop1: 'val',
				item2: 'val2',
				'spaced key': 'spaced out val'
			})
		}
	})

	test('Parser: Slow stream', async () => {
		const parser = new MultilineParser(false, () => null)
		expect(parser.receivedString('200 ok:\r\n')).toHaveLength(0)
		expect(parser.receivedString('key: val\r\n')).toHaveLength(0)
		expect(parser.receivedString('key2: val2\r\n')).toHaveLength(0)
		expect(parser.receivedString('\r\n')).toHaveLength(1)
	})

	test('Parser: Multiple at once', async () => {
		const parser = new MultilineParser(false, () => null)
		expect(parser.receivedString('200 ok\r\n200 ok\r\n200 ok\r\n')).toHaveLength(3)
	})

	test('Parser: Invalid ignored', async () => {
		const parser = new MultilineParser(false, () => null)
		expect(parser.receivedString('\r\n200 ok\r\n200ok\r\n200 ok\r\n')).toHaveLength(2)
	})

	test('Parser: Format Command', async () => {
		const rawLines = '216 format ready\r\ntgf66k'

		const parser = new MultilineParser(false, () => null)
		const res = parser.receivedString(rawLines)
		expect(res[0]).toBeTruthy()

		if (res[0]) {
			expect(res[0].code).toEqual(216)
			expect(res[0].name).toEqual('format ready')
			expect(res[0].params).toEqual({
				code: 'tgf66k'
			})
		}
	})

})
