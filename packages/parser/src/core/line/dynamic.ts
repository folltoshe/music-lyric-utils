import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem, ContentNormalOptionsRequired } from '@root/types'

import { EMPTY_LYRIC_DYNAMIC_WORD, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'

import { cloneDeep, insertSpace, checkFirstCharIsPunctuation, checkEndCharIsPunctuation } from '@music-lyric-utils/shared'
import { parseTagTime } from '@root/utils'

const TIME_AND_CONTENT = /(?<time><[^>]+>)(?<content>[^<]*)/gu
const TIME_TAG_2 = /<(?<start>[0-9]+),(?<duration>[0-9]+)\>/

const SPACE_START = /^\s+/
const SPACE_END = /\s+$/

const processLine = (options: ContentNormalOptionsRequired, line: MatchItem) => {
  const targetWords: Lyric.Line.Dynamic.Word[] = []

  const lineTime = parseTagTime(line.tag)
  if (lineTime === null) return

  for (const wordInfo of line.content.matchAll(TIME_AND_CONTENT)) {
    const wordLast = targetWords[targetWords.length - 1]
    const wordTimeTag = wordInfo.groups?.time || ''

    let wordTime = parseTagTime(wordTimeTag)
    let wordDuration = 0

    if (wordTime !== null) {
      wordDuration = wordLast?.time.start - wordTime
    } else {
      const timeMatchs = wordTimeTag.match(TIME_TAG_2)
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
      } else if (SPACE_START.test(wordContent)) {
        wordLast.config.needSpaceEnd = true
      } else if (checkFirstCharIsPunctuation(wordContentTrim)) {
        wordLast.config.needSpaceEnd = true
      }
    }

    const wordResult = cloneDeep(EMPTY_LYRIC_DYNAMIC_WORD)

    wordResult.time = {
      start: wordTime,
      end: wordTime + wordDuration,
      duration: wordDuration,
    }
    wordResult.text = options.insert.space.enable ? insertSpace(wordContentTrim, options.insert.space.types) : wordContentTrim

    if (SPACE_END.test(wordContent)) {
      wordResult.config.needSpaceEnd = true
    } else if (checkEndCharIsPunctuation(wordContentTrim)) {
      wordResult.config.needSpaceEnd = true
    }

    targetWords.push(wordResult)
  }

  const start = targetWords[0]?.time.start ?? lineTime
  const duration = targetWords.map((v) => v.time.duration).reduce((a, b) => a + b, 0)

  const time: Lyric.Time = {
    start,
    end: start + duration,
    duration,
  }

  const target: Lyric.Line.Info = cloneDeep(EMPTY_LYRIC_LINE)
  target.time = time
  target.content.original = targetWords.map((item) => `${item.text}${item.config.needSpaceEnd ? ' ' : ''}`).join('')
  target.content.dynamic = {
    time,
    words: targetWords,
  }

  return target
}

export const processDynamic = (context: Context, matched: MatchItem[]) => {
  if (matched.length <= 0) return null

  const options = context.options.getByKey('content.normal.dynamic')
  const result: Lyric.Line.Info[] = []
  for (const line of matched) {
    const item = processLine(options, line)
    if (!item) continue
    result.push(item)
  }

  return result
}
