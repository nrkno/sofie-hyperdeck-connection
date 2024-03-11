# Changelog

All notable changes to this project will be documented in this file. See [Convential Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) for commit guidelines.

## [2.0.1](https://github.com/nrkno/sofie-hyperdeck-connection/compare/v2.0.0...v2.0.1) (Mon Mar 11 2024)

### Fixes

- don't return videoFormat: null for async transport updates (#32) [de59cab](https://github.com/nrkno/sofie-hyperdeck-connection/commit/de59cabc523590e145cb9936b36653e774f3208b)

## [2.0.0](https://github.com/nrkno/sofie-hyperdeck-connection/compare/v1.0.0...v2.0.0) (Mon Jan 29 2024)

## Breaking changes

### Features

- **!** remove incorrect SlotId enum [930702d](https://github.com/nrkno/sofie-hyperdeck-connection/commit/930702daac61b9bb59509d138dde49f36e63bc9b)

### Fixes

- don't reject without an error [c8d9d31](https://github.com/nrkno/sofie-hyperdeck-connection/commit/c8d9d31b4d99b526cdea3974cbd97e6b285464ed)
- parse slotId correctly in notify.transport messages #12 [07905d7](https://github.com/nrkno/sofie-hyperdeck-connection/commit/07905d7507a4586b8b57f2cb712506006b25755f)
- account for how fractional frame rates are expressed in the timecode [e6f77be](https://github.com/nrkno/sofie-hyperdeck-connection/commit/e6f77be12aa327113501bc46604789329f0868c2)
- account for how drop-frame content is expressed in the timecode [90858ff](https://github.com/nrkno/sofie-hyperdeck-connection/commit/90858fff7118ea3968a58f65904f239efc1336f6)
- interlaced frame counting [9455421](https://github.com/nrkno/sofie-hyperdeck-connection/commit/9455421772b37c22c31342d335be6116ba17bf90)
- parse all clip info from the "disk list" command into separate fields [8d2dcb9](https://github.com/nrkno/sofie-hyperdeck-connection/commit/8d2dcb93e71c9aa1fba278bd1914ff03dcf941d6)

### Features

- add missing video formats [eae2185](https://github.com/nrkno/sofie-hyperdeck-connection/commit/eae2185fdf4d8b4321ee2f3cd588f36762b69b25)
- add inputVideoFormat to TransportInfoState [af392d0](https://github.com/nrkno/sofie-hyperdeck-connection/commit/af392d0ce409a7efcc9f75cd25e47d8386e39156)
- make event types be strongly defined [93e7573](https://github.com/nrkno/sofie-hyperdeck-connection/commit/93e7573062b2f82d9235c1b58c5cb896178060af)
- make `sendCommand` response Promise be typed [fb7a34b](https://github.com/nrkno/sofie-hyperdeck-connection/commit/fb7a34bda966022b96b6f2c382aae850a4a0ec9a)

## [1.0.0](https://github.com/nrkno/sofie-hyperdeck-connection/compare/0.5.0...v1.0.0) (2022-11-21)

### Breaking Changes

—

### Features

- **!** remove node 12 support [65fa9ee](https://github.com/nrkno/sofie-hyperdeck-connection/commit/65fa9ee766e5856be3bbcd366d0a1d7fd7ed4ffe)

## [0.5.0](https://github.com/nrkno/sofie-hyperdeck-connection/compare/0.4.4...0.5.0) (2022-04-29)

### ⚠ BREAKING CHANGES

- drop node10 support + switch to github actions

### Features

- add clips count command [publish] ([6d15db3](https://github.com/nrkno/sofie-hyperdeck-connection/commit/6d15db3b44e2bb03f976295d8c1b840cf8372def))
- configuration async handler [publish] ([e12dfc4](https://github.com/nrkno/sofie-hyperdeck-connection/commit/e12dfc4e0ccbc50d77bd164d84cadf5204efa4ed))
- update for protocol v1.11 (firmware V7) ([b25eae5](https://github.com/nrkno/sofie-hyperdeck-connection/commit/b25eae50a5031565a2497d66078ab043a0eb0903))
- update for protocol v1.11 (firmware V7) ([680b3ea](https://github.com/nrkno/sofie-hyperdeck-connection/commit/680b3ea1f1eb5ffb42a403a6e1123273b87a1a93))

### Bug Fixes

- 508 transport info may use active slot for slot id ([a3a5ce5](https://github.com/nrkno/sofie-hyperdeck-connection/commit/a3a5ce519a009ea8f6a6c5dd6b5c1cbb7f0a43f2))
- add 3g formats ([b4c9a37](https://github.com/nrkno/sofie-hyperdeck-connection/commit/b4c9a37e200e603d51d70948da17da615c10395d))
- always destroy the socket at the end of disconnect() ([87348bf](https://github.com/nrkno/sofie-hyperdeck-connection/commit/87348bf3f60fd03558d5a5b8509735883e0d54af))
- always use destroy instead of end ([212192a](https://github.com/nrkno/sofie-hyperdeck-connection/commit/212192adde21169510e2774b4cb31580eb972909))
- avoid emitting errors after disconnect has been called ([43c7769](https://github.com/nrkno/sofie-hyperdeck-connection/commit/43c77693c64aa9cd58afca8b51aae14af9a5984a))
- build errors after formatting ([6bd24a2](https://github.com/nrkno/sofie-hyperdeck-connection/commit/6bd24a20ec40f924d31510266766eb242e675f36))
- missing export for config async handler ([dbd6697](https://github.com/nrkno/sofie-hyperdeck-connection/commit/dbd6697f1eadd2bd998e7ac2a52bc92778f26de2))
- missing response code ([2601917](https://github.com/nrkno/sofie-hyperdeck-connection/commit/26019176991d3fe00db3335d71e43dcdf1f9a825))
- suppress errors when connection is inactive ([b7e540d](https://github.com/nrkno/sofie-hyperdeck-connection/commit/b7e540d8da2bd435a3af93f2c686b0cd4d62634a))
- throw error for missing promise ([5edd810](https://github.com/nrkno/sofie-hyperdeck-connection/commit/5edd810f71b633027177c705f5f288adf4b2c647))
- Updated URLs to match the renamed repo ([6644ac8](https://github.com/nrkno/sofie-hyperdeck-connection/commit/6644ac859adc2423e0daaf2019d05faabc5ecf2a))
- Updated URLs to match the renamed repo ([046c9b0](https://github.com/nrkno/sofie-hyperdeck-connection/commit/046c9b0efdec00d237adb615c3b12be4a77f8881))

- drop node10 support + switch to github actions ([1e9ffb3](https://github.com/nrkno/sofie-hyperdeck-connection/commit/1e9ffb386b3d868229f48a1589a81be4a12aa6a3))

### [0.4.4](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.4.3...0.4.4) (2020-10-29)

### Features

- **ci:** prereleases flow & optional audit skip [skip ci] ([37b48a4](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/37b48a4bac0b315ea074a3463cf33a9fbbc2fdc1))
- **ci:** prereleases flow & optional audit skip [skip ci] ([37b48a4](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/37b48a4bac0b315ea074a3463cf33a9fbbc2fdc1))

### [0.4.3](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.4.2...0.4.3) (2020-01-10)

### [0.4.2](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.4.1...0.4.2) (2019-12-23)

### Bug Fixes

- FormatCommand response has a colon on newer firmware versions ([5aa9071](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/5aa9071fafb6493e7e664743dc680499a9d2d205))

### [0.4.1](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.4.0...0.4.1) (2019-12-11)

### Features

- update ci to run for node 8,10,12 ([9ae081a](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/9ae081a906129447b9bbc3f5a6556a27fe068c3b))

### Bug Fixes

- goTo command ([aa40de8](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/aa40de8bd9dbbc82cf0d1a8404df0fe9f9063f5d))

<a name="0.4.0"></a>

# [0.4.0](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.3.0...0.4.0) (2019-10-08)

### Bug Fixes

- Configuration Command ([ab5bf19](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/ab5bf19))
- Device Info carries slot count and not unique id ([0a8a09e](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/0a8a09e))
- export shuttle command ([ed33dc5](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/ed33dc5))

### Features

- configuration command ([e7c47d4](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/e7c47d4))
- goto command ([bc05045](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/bc05045))
- jog command ([cbcd0cf](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/cbcd0cf))
- play command ([14bb340](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/14bb340))
- remote command ([7d8b254](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/7d8b254))
- shuttle command ([b412641](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/b412641))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.2.0...0.3.0) (2019-09-02)

### Features

- quit command before closing connection ([ece4982](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/ece4982))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.5...0.2.0) (2019-08-06)

### Features

- **SlotInfo:** add optional slot id ([a73084b](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/a73084b))
- disk formatting commands ([6fd124c](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/6fd124c))
- slot select command ([c70c509](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/c70c509))

<a name="0.1.5"></a>

## [0.1.5](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.4...0.1.5) (2019-04-25)

### Bug Fixes

- ping timeouts should trigger reconnect ([1e4a810](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/1e4a810))

<a name="0.1.4"></a>

## [0.1.4](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.3...0.1.4) (2019-03-04)

### Bug Fixes

- audit fix for vulnerabilities ([a739543](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/a739543))
- remove cpx dependencey. Not used, causes errors ([8b3c5e5](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/8b3c5e5))

<a name="0.1.3"></a>

## [0.1.3](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.2...0.1.3) (2019-01-25)

### Bug Fixes

- reconnect logic on close event rather than end ([2688ac1](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/2688ac1))

<a name="0.1.2"></a>

## [0.1.2](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.1...0.1.2) (2018-10-18)

### Bug Fixes

- Reconnection not working properly ([6a40896](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/6a40896))

<a name="0.1.1"></a>

## [0.1.1](https://github.com/nrkno/tv-automation-hyperdeck-connection/compare/0.1.0...0.1.1) (2018-10-18)

### Bug Fixes

- no change, just to trigger deploy ([4755900](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/4755900))

<a name="0.1.0"></a>

# 0.1.0 (2018-10-16)

### Bug Fixes

- some typos. Adds some tests for hyperdeck class ([01b4634](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/01b4634))
- Tidying and fixes for integrating with tsr ([58b7d94](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/58b7d94))
- transport info changes properties are nowoptional ([83815ab](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/83815ab))

### Features

- Add some more simple commands and refactor deserialization ([ec6e4b1](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/ec6e4b1))
- connection retry logic. test for ping timeout ([b1f395d](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/b1f395d))
- Initial working connection ([e5e264c](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/e5e264c))
- Parse transport info and async transport changes ([2bfbd1e](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/2bfbd1e))
- refactor the async handlers to be chosen more dynamically ([0605108](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/0605108))
- Remove promise from command, and create it when command is queued instead ([6577549](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/6577549))
- send pings to detect timeouts ([7d4dd3f](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/7d4dd3f))
- slot info command ([af7c0ce](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/af7c0ce))
- Tidy up remaining todos ([7cea4ad](https://github.com/nrkno/tv-automation-hyperdeck-connection/commit/7cea4ad))
