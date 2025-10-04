import type { LyricTimeInfo, LyricInfo, LyricLine, LyricDynamicWord, LyricDynamicInfo } from '@music-lyric-utils/shared'
import type { ParsedLyricLine } from '../utils'
import type { RequiredParserOptions } from '../interface'

import {
  EMPTY_LYRIC_INFO,
  EMPTY_LYRIC_DYNAMIC_INFO,
  EMPTY_LYRIC_DYNAMIC_WORD,
  EMPTY_LYRIC_LINE,
  checkEndCharIsPunctuation,
  checkFirstCharIsPunctuation,
} from '@music-lyric-utils/shared'

import { cloneDeep, parseInt } from 'lodash'
import { parseTagTime } from '../utils'

const DYNAMIC_LINE_WORD_AND_TIME_REGEXP = /(?<time><[^>]+>)(?<content>[^<]*)/gu

const DYNAMIC_LINE_WORD_TIME_2 = /<(?<start>[0-9]+),(?<duration>[0-9]+)\>/

const DYNAMIC_LINE_WORD_SPACE_START = /^\s+/

const DYNAMIC_LINE_WORD_SPACE_END = /\s+$/

export const processDynamicLine = (options: RequiredParserOptions['content'], lineInfo: ParsedLyricLine) => {
  const resultWordInfo: LyricDynamicInfo = cloneDeep(EMPTY_LYRIC_DYNAMIC_INFO)
  const resultWords: LyricDynamicWord[] = []

  const lineTime = parseTagTime(lineInfo.tag)
  if (lineTime === null) return

  for (const wordInfo of lineInfo.content.matchAll(DYNAMIC_LINE_WORD_AND_TIME_REGEXP)) {
    const wordLast = resultWords[resultWords.length - 1]
    const wordTimeTag = wordInfo.groups?.time || ''

    let wordTime = parseTagTime(wordTimeTag)
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

    if (wordLast && !wordLast.config.needSpaceEnd) {
      if (!wordContentTrim) {
        wordLast.config.needSpaceEnd = true
        continue
      } else if (DYNAMIC_LINE_WORD_SPACE_START.test(wordContent)) {
        wordLast.config.needSpaceEnd = true
      } else if (options.replace.insertSpaceToPunctuation && checkFirstCharIsPunctuation(wordContent)) {
        wordLast.config.needSpaceEnd = true
      }
    }

    const wordResult = cloneDeep(EMPTY_LYRIC_DYNAMIC_WORD)

    wordResult.time = {
      start: wordTime,
      end: wordTime + wordDuration,
      duration: wordDuration,
    }
    wordResult.text = wordContentTrim

    if (DYNAMIC_LINE_WORD_SPACE_END.test(wordContent)) {
      wordResult.config.needSpaceEnd = true
    } else if (options.replace.insertSpaceToPunctuation && checkEndCharIsPunctuation(wordContentTrim)) {
      wordResult.config.needSpaceEnd = true
    }

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

  return resultLine
}

export const processDynamicLyric = (options: RequiredParserOptions['content'], matchedLines: ParsedLyricLine[]) => {
  const result: LyricInfo = cloneDeep(EMPTY_LYRIC_INFO)

  const lines: LyricLine[] = []
  for (const line of matchedLines) {
    const item = processDynamicLine(options, line)
    if (!item) continue
    lines.push(item)
  }

  result.config.isSupportAutoScroll = !!lines.find((line) => line.time.start > 0)
  result.lines = lines

  return result
}
