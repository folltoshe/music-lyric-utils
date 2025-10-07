import type { LyricLine } from '@music-lyric-utils/shared'

import { TEXT_SPACER_PROCESS_TYPE } from '@music-lyric-utils/shared'

import { TextSpacer } from '@music-lyric-utils/shared'

const spacer = new TextSpacer(TEXT_SPACER_PROCESS_TYPE.PUNCTUATION)

export const insertSpace = (lines: LyricLine[]) => {
  return lines.map((line) => {
    if (line.content.dynamic) {
      line.content.dynamic.words = line.content.dynamic.words.map((item) => {
        item.text = spacer.process(item.text)
        return item
      })
      line.content.original = line.content.dynamic.words
        .map((item) => {
          return `${item.text}${item.config.needSpaceEnd ? ' ' : ''}`
        })
        .join('')
    } else {
      line.content.original = spacer.process(line.content.original)
    }
    if (line.content.translated) {
      line.content.translated = spacer.process(line.content.translated)
    }
    if (line.content.roman) {
      line.content.roman = spacer.process(line.content.roman)
    }
    return line
  })
}
