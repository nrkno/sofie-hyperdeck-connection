# Sofie HyperDeck Connection Library
[![CircleCI](https://circleci.com/gh/nrkno/sofie-hyperdeck-connection.svg?style=svg)](https://circleci.com/gh/nrkno/sofie-hyperdeck-connection)
[![codecov](https://codecov.io/gh/nrkno/sofie-hyperdeck-connection/branch/master/graph/badge.svg)](https://codecov.io/gh/nrkno/sofie-hyperdeck-connection)

This is the _HyperDeck Connection_ library of the [**Sofie** TV Automation System](https://github.com/nrkno/Sofie-TV-automation/), used for connecting to Blackmagic Design's _HyperDeck_ devices.


## General Sofie System Information
* [_Sofie_ Documentation](https://nrkno.github.io/sofie-core/)
* [_Sofie_ Releases](https://nrkno.github.io/sofie-core/releases)
* [Contribution Guidelines](CONTRIBUTING.md)
* [License](LICENSE)

---

## Technology Highlights

- Typescript
- Yarn
- Jeststandard-version
- codecov

## Installation

For usage by library consumers installation is as easy as:

```sh
yarn add hyperdeck-connection
```

For library developers installation steps are as following:

```sh
git clone https://github.com/nrkno/tv-automation-hyperdeck-connection
yarn
yarn build
```

If you want to make a contribution, feel free to open a PR.

## Usage

```javascript
const { Hyperdeck, Commands } = require('hyperdeck-connection')
const myHyperdeck = new Hyperdeck()

myHyperdeck.connect('192.168.168.100')

myHyperdeck.on('connected', (info) => {
	console.log(info)
	// ConnectionInfoResponse {
	//  protocolVersion: 1.6,
	//  model:
	// }

	myHyperdeck.sendCommand(new Commands.RecordCommand('some_filename')).then(() => {
		console.log('recording')
	})

	myHyperdeck.sendCommand(new Commands.TransportInfoCommand()).then((transportInfo) => {
		console.log(transportInfo)
	})
})

myHyperdeck.on('notify.slot', function (err, state) {
	console.log(state) // catch the slot state change.
})
myHyperdeck.on('notify.transport', function (err, state) {
	console.log(state) // catch the transport state change.
})
myHyperdeck.on('error', (err) => {
	console.log('Hyperdeck error', err)
})
```

### Events

- `connected`
  This event will be fired once we have connected with the hyperdeck.

- `disconnected`
  Whenever the connection is lost. connected may be fired against shortly after if the connection is restored

## Test

This module will run tests by jest.

```sh
$ yarn unit
```

---

_The NRK logo is a registered trademark of Norsk rikskringkasting AS. The license does not grant any right to use, in any way, any trademarks, service marks or logos of Norsk rikskringkasting AS._
