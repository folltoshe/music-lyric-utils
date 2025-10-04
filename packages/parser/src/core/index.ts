import type { LyricInfo, LyricLine } from '@music-lyric-utils/shared'
import type { ParseLyricProps, ParserOptions, RequiredParserOptions } from '../interface'

import { LYRIC_LINE_TYPES, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'
import { PARSER_DEFAULT_OPTIONS } from '../constant'

import { cloneDeep } from 'lodash'
import { OptionsManager, replaceChinesePunctuationToEnglish } from '@music-lyric-utils/shared'
import { alignLyricWithTime } from '../utils'

import { processNormalLyric } from './normal'
import { processDynamicLyric } from './dynamic'
import { processLyricMeta } from './meta'
import { matchLyric } from './match'

export const isInterludeLine = (line: LyricLine) => {
  return line.type === LYRIC_LINE_TYPES.INTERLUDE
}

export class LyricParser {
  private options = new OptionsManager<RequiredParserOptions>(PARSER_DEFAULT_OPTIONS)

  constructor(opt?: ParserOptions) {
    if (opt) {
      this.options.setAll(opt)
    }
  }

  updateOptionsWithKey = this.options.setByKey.bind(this.options)

  updateOptions = this.options.setAll.bind(this.options)

  parse({ original = '', translate = '', roman = '', dynamic = '' }: ParseLyricProps): LyricInfo | null {
    const matchedLyric = matchLyric(original)
    if (!matchedLyric) return null

    const targetLyric = processNormalLyric(matchedLyric.lines)
    const targetMeta = processLyricMeta(this.options.getByKey('meta'), matchedLyric.metas)

    if (!targetLyric.config.isSupportAutoScroll) {
      targetLyric.meta = targetMeta
      return targetLyric
    }

    const matchedDynamic = matchLyric(dynamic)
    const targetDynamic = matchedDynamic && processDynamicLyric(matchedDynamic.lines)

    const matchedTranslate = matchLyric(translate)
    const targetTranslate = matchedTranslate && processNormalLyric(matchedTranslate.lines)

    const matchedRoman = matchLyric(roman)
    const targetRoman = matchedRoman && processNormalLyric(matchedRoman.lines)

    const alignTarget = targetDynamic ?? targetLyric
    const aligndTranslate = targetTranslate ? alignLyricWithTime({ base: alignTarget.lines, target: targetTranslate.lines }) : null
    const aligndRoman = targetRoman ? alignLyricWithTime({ base: alignTarget.lines, target: targetRoman.lines }) : null

    const resultLyric = { ...alignTarget }
    for (const line of resultLyric.lines) {
      if (aligndTranslate) {
        const target = aligndTranslate.find((v) => v.time.start === line.time.start) as LyricLine
        if (target) line.content.translated = target.content.original
      }
      if (aligndRoman) {
        const target = aligndRoman.find((v) => v.time.start === line.time.start) as LyricLine
        if (target) line.content.roman = target.content.original
      }
    }

    const replaceChinesePunctuationToEnglishOptions = this.options.getByKey('content.replace.chinesePunctuationToEnglish')
    for (let index = 0, length = resultLyric.lines.length; index < length; index++) {
      const current = resultLyric.lines[index]
      const next = resultLyric.lines[index + 1]

      // check first line is time too long
      if (index === 0 && current.time.start > 5000) {
        const line = cloneDeep(EMPTY_LYRIC_LINE)
        const start = 500
        const duration = current.time.start - start
        const end = current.time.start + duration
        line.time = { start, end, duration }
        line.type = LYRIC_LINE_TYPES.INTERLUDE
        resultLyric.lines.unshift(line)
      }

      // replace chinese punctuation
      if (replaceChinesePunctuationToEnglishOptions.original) {
        current.content.original = replaceChinesePunctuationToEnglish(current.content.original)
      }
      if (replaceChinesePunctuationToEnglishOptions.translate && current.content.translated) {
        current.content.translated = replaceChinesePunctuationToEnglish(current.content.translated)
      }
      if (replaceChinesePunctuationToEnglishOptions.roman && current.content.roman) {
        current.content.roman = replaceChinesePunctuationToEnglish(current.content.roman)
      }
      if (replaceChinesePunctuationToEnglishOptions.dynamic && current.content.dynamic) {
        current.content.dynamic.words = current.content.dynamic.words.map((item) => {
          return { ...item, text: replaceChinesePunctuationToEnglish(item.text) }
        })
      }

      // add interlude
      if (next && this.options.getByKey('interlude.show') === true && next.time.start - current.time.end > this.options.getByKey('interlude.checkTime')) {
        const line = cloneDeep(EMPTY_LYRIC_LINE)
        const start = current.time.end + 100
        const duration = Math.max(next.time.start - start, 0)
        const end = current.time.end + duration
        line.time = { start, end, duration }
        line.type = LYRIC_LINE_TYPES.INTERLUDE
        resultLyric.lines.push(line)
      }
    }

    resultLyric.lines = resultLyric.lines.sort((a, b) => a.time.start - b.time.start)
    resultLyric.meta = targetMeta

    return resultLyric
  }
}
