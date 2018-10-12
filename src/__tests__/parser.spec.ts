import { MultilineParser, buildMessageStr } from '../parser'
import { NamedMessage } from '../message'

describe('Parser', () => {

	test('Parser: response single line', async () => {
		const msg: NamedMessage = {
			Name: 'some phrase',
			Params: {}
		}

		const str = buildMessageStr(msg)
		expect(str).toEqual('some phrase\r\n')
	})

	test('Parser: response multiline', async () => {
		const msg: NamedMessage = {
			Name: 'some phrase',
			Params: {
				'item one': 'val 1'
			}
		}

		const str = buildMessageStr(msg)
		expect(str).toEqual('some phrase:\r\nitem one: val 1\r\n\r\n')
	})

	test('Parser: Single line', async () => {
		const rawLines = ['200 ok']

		const parser = new MultilineParser(false, () => {})
		const res = parser.parseResponse(rawLines)
		expect(res).toBeTruthy()

		if (res) {
			expect(res.Code).toEqual(200)
			expect(res.Name).toEqual('ok')
			expect(res.Params).toEqual({})
		}
	})

	test('Parser: Broken line', async () => {
		const rawLines = ['200ok']

		const parser = new MultilineParser(false, () => {})
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

		const parser = new MultilineParser(false, () => {})
		const res = parser.parseResponse(rawLines)
		expect(res).toBeTruthy()

		if (res) {
			expect(res.Code).toEqual(200)
			expect(res.Name).toEqual('spaced name')
			expect(res.Params).toEqual({
				prop1: 'val',
				item2: 'val2',
				'spaced key': 'spaced out val'
			})
		}
	})

	test('Parser: Slow stream', async () => {
		const parser = new MultilineParser(false, () => {})
		expect(parser.receivedString('200 ok:\r\n')).toHaveLength(0)
		expect(parser.receivedString('key: val\r\n')).toHaveLength(0)
		expect(parser.receivedString('key2: val2\r\n')).toHaveLength(0)
		expect(parser.receivedString('\r\n')).toHaveLength(1)
	})

	test('Parser: Multiple at once', async () => {
		const parser = new MultilineParser(false, () => {})
		expect(parser.receivedString('200 ok\r\n200 ok\r\n200 ok\r\n')).toHaveLength(3)
	})

	test('Parser: Invalid ignored', async () => {
		const parser = new MultilineParser(false, () => {})
		expect(parser.receivedString('\r\n200 ok\r\n200ok\r\n200 ok\r\n')).toHaveLength(2)
	})

})
