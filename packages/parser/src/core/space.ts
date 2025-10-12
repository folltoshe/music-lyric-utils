import type { Lyric } from '@music-lyric-utils/shared'
import type { RequiredParserOptions } from '@root/interface'

import { checkEndCharIsPunctuation, checkFirstCharIsPunctuation, INSERT_TEXT_SPACE_TYPES, insertSpace } from '@music-lyric-utils/shared'

export const insertSpaceForLines = (options: RequiredParserOptions['content']['insertSpace'], lines: Lyric.Line.Info[]) => {
  if (!options.enable) return lines

  for (const line of lines) {
    if (line.content.dynamic) {
      line.content.dynamic.words = line.content.dynamic.words.map((item, index, array) => {
        item.text = insertSpace(item.text, options.types)
        if (options.types.includes(INSERT_TEXT_SPACE_TYPES.PUNCTUATION)) {
          const last = array[index]
          if (!last.config.needSpaceEnd && checkFirstCharIsPunctuation(item.text)) {
            last.config.needSpaceEnd = true
          }
          if (!item.config.needSpaceEnd && checkEndCharIsPunctuation(item.text)) {
            item.config.needSpaceEnd = true
          }
        }
        return item
      })
      line.content.original = line.content.dynamic.words
        .map((item) => {
          return `${item.text}${item.config.needSpaceEnd ? ' ' : ''}`
        })
        .join('')
    } else {
      line.content.original = insertSpace(line.content.original, options.types)
    }
    if (line.content.translated) {
      line.content.translated = insertSpace(line.content.translated, options.types)
    }
    if (line.content.roman) {
      line.content.roman = insertSpace(line.content.roman, options.types)
    }
  }

  return lines
}
