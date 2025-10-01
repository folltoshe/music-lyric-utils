import Example from './example'
import { LyricParser } from '@music-lyric-utils/parser'

const parser = new LyricParser()

const result = parser.parse({
  original: Example.original,
  dynamic: Example.dynamic,
  translate: Example.translate,
})

console.log(JSON.stringify(result))
