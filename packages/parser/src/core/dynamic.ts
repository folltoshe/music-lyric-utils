import { cloneDeep, parseInt } from 'lodash'
import {
  type LyricTimeInfo,
  type LyricInfo,
  type LyricLine,
  EMPTY_LYRIC_INFO,
  type LyricDynamicWord,
  type LyricDynamicInfo,
  EMPTY_LYRIC_DYNAMIC_INFO,
  EMPTY_LYRIC_DYNAMIC_WORD,
  EMPTY_LYRIC_LINE,
} from '@music-lyric-utils/shared'
import { parseLyricLine, parseLyricTagTime } from '../utils'

const DYNAMIC_LINE_WORD_AND_TIME_REGEXP = /(?<time><[^>]+>)(?<content>[^<]*)/gu

const DYNAMIC_LINE_WORD_TIME_2 = /<(?<start>[0-9]+),(?<duration>[0-9]+)\>/

const DYNAMIC_LINE_WORD_SPACE_START = /^\s+/

const DYNAMIC_LINE_WORD_SPACE_END = /\s+$/

export const processDynamicLine = (line: string) => {
  const result: LyricLine[] = []

  for (const lineInfo of parseLyricLine(line, true)) {
    const resultWordInfo: LyricDynamicInfo = cloneDeep(EMPTY_LYRIC_DYNAMIC_INFO)
    const resultWords: LyricDynamicWord[] = []

    const lineTime = parseLyricTagTime(lineInfo.tag)
    if (lineTime === null) continue

    for (const wordInfo of lineInfo.line.matchAll(DYNAMIC_LINE_WORD_AND_TIME_REGEXP)) {
      const wordLast = resultWords[resultWords.length - 1]
      const wordTimeTag = wordInfo.groups?.time || ''

      let wordTime = parseLyricTagTime(wordTimeTag)
      let wordDuration = 0

      if (wordTime !== null) {
        wordDuration = wordLast?.time.start - wordTime
      } else {
        const timeMatchs = wordTimeTag.match(DYNAMIC_LINE_WORD_TIME_2)
        if (timeMatchs?.groups) {
          wordTime = lineTime + (parseInt(timeMatchs.groups?.start) || 0)
          wordDuration = parseInt(timeMatchs.groups.duration) || 0
        }
      }

      if (wordTime === null) continue

      const wordContent = wordInfo.groups?.content
      if (!wordContent) continue

      const wordContentTrim = wordContent.trim()
      if (!wordContentTrim || DYNAMIC_LINE_WORD_SPACE_START.test(wordContent)) {
        if (wordLast) wordLast.config.needSpaceEnd = true
        continue
      }

      const wordResult = cloneDeep(EMPTY_LYRIC_DYNAMIC_WORD)

      wordResult.time = {
        start: wordTime,
        end: wordTime + wordDuration,
        duration: wordDuration,
      }
      wordResult.text = wordContentTrim
      wordResult.config.needSpaceEnd = DYNAMIC_LINE_WORD_SPACE_END.test(wordContent)

      resultWords.push(wordResult)
    }

    const start = resultWords[0]?.time.start ?? lineTime
    const duration = resultWords.map((v) => v.time.duration).reduce((a, b) => a + b, 0)

    const timeInfo: LyricTimeInfo = {
      start,
      end: start + duration,
      duration,
    }
    resultWordInfo.time = timeInfo
    resultWordInfo.words = resultWords

    const resultLine = cloneDeep(EMPTY_LYRIC_LINE)
    resultLine.time = timeInfo
    resultLine.content.dynamic = resultWordInfo
    resultLine.content.original = resultWordInfo.words.map((item) => `${item.text}${item.config.needSpaceEnd ? ' ' : ''}`).join('')

    result.push(resultLine)
  }

  return result
}

export const processDynamicLyric = (lyric: string) => {
  const result: LyricInfo = cloneDeep(EMPTY_LYRIC_INFO)

  const lines: LyricLine[] = []
  for (const line of lyric.split('\n')) {
    const items = processDynamicLine(line)
    lines.push(...items)
  }

  result.config.isSupportAutoScroll = !!lines.find((line) => line.time.start > 0)
  result.lines = lines

  return result
}
