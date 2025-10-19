<div align="center">
  <img src="https://socialify.git.ci/folltoshe/music-lyric-utils/image?custom_description=A+Music+Lyric+Utils&description=1&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto" />
</div>

## Install

```shell
npm install @music-lyric-utils/parser @music-lyric-utils/player
```

## Usage

```js
import { LyricParser } from '@music-lyric-utils/parser'
import { LyricPlayer } from '@music-lyric-utils/player'

const parser = new LyricParser()
const player = new LyricPlayer({
  onLinePlay(num, line) {
    console.log('on line play')
    console.log(num, line)
  },
  onSetLyric(info) {
    console.log('on set lyric')
    console.log(info)
  },
})

const origin = ''
const dynamic = ''
const translate = ''
const roman = ''

const info = parser.parse({ original, dynamic, translate, roman })

player.updateLyric(info)

player.play()
```

## Features

- Format Support

  - [x] LRC
  - [ ] TTML

- Export Lyric

  - [ ] LRC
  - [ ] TTML

- Parse Lyric

  - [x] Original
  - [x] Dynamic
  - [x] Translate
  - [x] Roman

- Parse Meta

  - [x] Meta Tag
  - [x] Auto Match Producer

- Extra

  - [x] Insert Space
  - [x] Insert Interlude Line
  - [x] Insert Duet Info
  - [x] Purification Lyrics

## Contributor

[![Contributor](https://contrib.rocks/image?repo=folltoshe/music-lyric-utils)](https://github.com/folltoshe/music-lyric-utils/graphs/contributors)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2025 - now, Folltoshe
