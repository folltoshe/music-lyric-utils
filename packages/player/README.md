## Install

```shell
npm install @music-lyric-utils/player
```

## Usage

```js
import { LyricPlayer } from '@music-lyric-utils/player'

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

// parser result
const info = {}

player.updateLyric(info)

player.play()
```
