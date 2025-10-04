import type { LyricInfo, LyricLine } from '@music-lyric-utils/shared'
import type { ParseLyricProps, ParserOptions, RequiredParserOptions } from '../interface'

import { LYRIC_LINE_TYPES, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'
import { PARSER_DEFAULT_OPTIONS } from '../constant'

import { cloneDeep } from 'lodash'
import { OptionsManager, replaceChinesePunctuationToEnglish } from '@music-lyric-utils/shared'
import { alignLyricWithTime } from '../utils'

import { processNormalLyric } from './normal'
import { processDynamicLyric } from './dynamic'
import { processLyricMeta, matchProducers } from './meta'
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
    const contentOptions = this.options.getByKey('content')
    const metaOptions = this.options.getByKey('meta')
    const matchOptions = this.options.getByKey('match')

    // replace chinese punctuation
    const replaceOptions = contentOptions.replace.chinesePunctuationToEnglish
    const replacedOriginal = replaceOptions.original ? replaceChinesePunctuationToEnglish(original) : original
    const replacedTranslate = replaceOptions.translate ? replaceChinesePunctuationToEnglish(translate) : translate
    const replacedRoman = replaceOptions.roman ? replaceChinesePunctuationToEnglish(roman) : roman
    const replacedDynamic = replaceOptions.dynamic ? replaceChinesePunctuationToEnglish(dynamic) : dynamic

    const matchedOriginal = matchLyric(replacedOriginal)
    const matchedDynamic = matchLyric(replacedDynamic)
    if (!matchedDynamic && !matchedOriginal) return null

    const [targetLyric, targetMeta] = matchedDynamic
      ? [processDynamicLyric(contentOptions, matchedDynamic.lines), processLyricMeta(metaOptions, matchedDynamic.metas)]
      : matchedOriginal
      ? [processNormalLyric(contentOptions, matchedOriginal.lines), processLyricMeta(metaOptions, matchedOriginal.metas)]
      : [null, null]
    if (!targetLyric) return null

    const { lines: targetLines, producers } = matchProducers(matchOptions.producers, targetLyric.lines)
    if (producers.length) targetMeta.producers = producers
    targetLyric.lines = targetLines

    if (!targetLyric.config.isSupportAutoScroll) {
      targetLyric.meta = targetMeta
      return targetLyric
    }

    const matchedTranslate = matchLyric(replacedTranslate)
    const targetTranslate = matchedTranslate && processNormalLyric(contentOptions, matchedTranslate.lines)

    const matchedRoman = matchLyric(replacedRoman)
    const targetRoman = matchedRoman && processNormalLyric(contentOptions, matchedRoman.lines)

    const aligndTranslate = targetTranslate ? alignLyricWithTime({ base: targetLyric.lines, target: targetTranslate.lines }) : null
    const aligndRoman = targetRoman ? alignLyricWithTime({ base: targetLyric.lines, target: targetRoman.lines }) : null

    const resultLyric = { ...targetLyric }
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

    for (let index = 0, length = resultLyric.lines.length; index < length; index++) {
      const current = resultLyric.lines[index]
      const next = resultLyric.lines[index + 1]

      // add interlude when first line is time too long
      if (this.options.getByKey('interlude.show') && index === 0 && current.time.start > 5000) {
        const line = cloneDeep(EMPTY_LYRIC_LINE)
        const start = 500
        const duration = current.time.start - start
        const end = current.time.start + duration
        line.time = { start, end, duration }
        line.type = LYRIC_LINE_TYPES.INTERLUDE
        resultLyric.lines.unshift(line)
      }
      // add interlude
      if (this.options.getByKey('interlude.show') && next && next.time.start - current.time.end > this.options.getByKey('interlude.checkTime')) {
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
