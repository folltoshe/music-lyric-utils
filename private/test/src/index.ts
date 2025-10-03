import Example from './example'
import { LyricParser } from '@music-lyric-utils/parser'
import { LyricPlayer } from '@music-lyric-utils/player'

const parser = new LyricParser()

const result = parser.parse({
  original: Example.original,
  dynamic: Example.dynamic,
  translate: Example.translate,
})

console.log(JSON.stringify(result, null, 2))

const player = new LyricPlayer({
  offset: 0,
  speed: 1,
  onLinePlay(lineNum, info) {
    console.log(`onLinePlay: ${lineNum}`)
  },
  onSetLyric(info) {
    console.log(`onSetLyric`)
  },
})

if (result) player.updateLyric(result)

player.play(5000)
