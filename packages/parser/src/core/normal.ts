import type { LyricInfo, LyricLine } from '@music-lyric-utils/shared'
import type { ParsedLyricLine } from '../utils'
import type { RequiredParserOptions } from '../interface'

import { EMPTY_LYRIC_LINE, EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'
import { parseTagTime } from '../utils'

export const processNormalLine = (options: RequiredParserOptions['content'], lineInfo: ParsedLyricLine) => {
  const time = parseTagTime(lineInfo.tag) || 0
  const result = cloneDeep(EMPTY_LYRIC_LINE)
  result.time.start = time
  result.content.original = lineInfo.content
  return result
}

export const processNormalLyric = (options: RequiredParserOptions['content'], matchedLines: ParsedLyricLine[]) => {
  const result: LyricInfo = cloneDeep(EMPTY_LYRIC_INFO)

  const lines: LyricLine[] = []
  for (const line of matchedLines) {
    const item = processNormalLine(options, line)
    if (!item) continue
    lines.push(item)
  }

  for (let index = 0; index < lines.length; index++) {
    const current = lines[index]
    const next = lines[index + 1]
    if (!next) continue
    const currentDuration = next.time.start - current.time.start
    current.time.duration = currentDuration
    current.time.end = next.time.start
  }

  result.config.isSupportAutoScroll = !!lines.find((line) => line.time.start > 0)
  result.lines = lines

  return result
}
