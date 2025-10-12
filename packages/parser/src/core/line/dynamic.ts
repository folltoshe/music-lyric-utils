import type { Lyric } from '@music-lyric-utils/shared'
import type { ParsedLyricLine } from '@root/utils'
import type { ParserOptionsWithManager, RequiredParserOptions } from '@root/types/options'

import { EMPTY_LYRIC_INFO, EMPTY_LYRIC_DYNAMIC_INFO, EMPTY_LYRIC_DYNAMIC_WORD, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'

import { cloneDeep, insertSpace, checkFirstCharIsPunctuation, checkEndCharIsPunctuation } from '@music-lyric-utils/shared'
import { parseTagTime } from '@root/utils'

const DYNAMIC_LINE_WORD_AND_TIME_REGEXP = /(?<time><[^>]+>)(?<content>[^<]*)/gu
const DYNAMIC_LINE_WORD_TIME_2 = /<(?<start>[0-9]+),(?<duration>[0-9]+)\>/

const DYNAMIC_LINE_WORD_SPACE_START = /^\s+/
const DYNAMIC_LINE_WORD_SPACE_END = /\s+$/

export class DynamicParser {
  private insertSpaceEnable: boolean = false
  private insertSpaceTypes: RequiredParserOptions['content']['insertSpace']['types'] = []

  constructor(protected options: ParserOptionsWithManager) {
    this.options.on('config-update', this.onConfigUpdate.bind(this))
  }

  private onConfigUpdate() {
    this.insertSpaceEnable = this.options.getByKey('content.insertSpace.enable')
    this.insertSpaceTypes = this.insertSpaceEnable ? this.options.getByKey('content.insertSpace.types') : []
  }

  parseLine(lineInfo: ParsedLyricLine) {
    const resultWordInfo: Lyric.Line.Dynamic.Info = cloneDeep(EMPTY_LYRIC_DYNAMIC_INFO)
    const resultWords: Lyric.Line.Dynamic.Word[] = []

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
      wordResult.text = this.insertSpaceEnable ? insertSpace(wordContentTrim, this.insertSpaceTypes) : wordContentTrim

      if (DYNAMIC_LINE_WORD_SPACE_END.test(wordContent)) {
        wordResult.config.needSpaceEnd = true
      } else if (checkEndCharIsPunctuation(wordContentTrim)) {
        wordResult.config.needSpaceEnd = true
      }

      resultWords.push(wordResult)
    }

    const start = resultWords[0]?.time.start ?? lineTime
    const duration = resultWords.map((v) => v.time.duration).reduce((a, b) => a + b, 0)

    const timeInfo: Lyric.Time = {
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

  parse(matched: ParsedLyricLine[]) {
    const result: Lyric.Info = cloneDeep(EMPTY_LYRIC_INFO)

    const lines: Lyric.Line.Info[] = []
    for (const line of matched) {
      const item = this.parseLine(line)
      if (!item) continue
      lines.push(item)
    }

    result.config.isSupportAutoScroll = !!lines.find((line) => line.time.start > 0)
    result.lines = lines

    return result
  }
}
