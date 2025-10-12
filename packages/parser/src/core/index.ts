import type { Lyric } from '@music-lyric-utils/shared'
import type { ParseLyricProps, ParserOptions, RequiredParserOptions } from '@root/interface'

import { LYRIC_LINE_TYPES, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'
import { DEFAULT_PARSER_OPTIONS } from '../constant/options'

import { cloneDeep, OptionsManager } from '@music-lyric-utils/shared'
import { alignLyricWithTime } from '../utils'

import { LineParser } from './line'
import { MetaParser } from './meta'

import { matchLyric } from './match'
import { insertSpaceForLines } from './space'

export const isInterludeLine = (line: Lyric.Line.Info) => {
  return line.type === LYRIC_LINE_TYPES.INTERLUDE
}

abstract class LyricParserOptions {
  protected options = new OptionsManager<RequiredParserOptions>(DEFAULT_PARSER_OPTIONS)

  constructor(opt?: ParserOptions) {
    if (opt) this.options.setAll(opt)
  }

  protected abstract onUpdateOptions(): void

  updateOptionsWithKey(...args: Parameters<typeof this.options.setByKey>) {
    this.options.setByKey(...args)
    this.onUpdateOptions()
  }

  updateOptions(...args: Parameters<typeof this.options.setAll>) {
    this.options.setAll(...args)
    this.onUpdateOptions()
  }
}

export class LyricParser extends LyricParserOptions {
  protected line = new LineParser(this.options)
  protected meta = new MetaParser(this.options)

  constructor(opt?: ParserOptions) {
    super(opt)
  }

  protected override onUpdateOptions(): void {}

  parse({ original = '', translate = '', roman = '', dynamic = '' }: ParseLyricProps): Lyric.Info | null {
    const replaceOptions = this.options.getByKey('content.replace.chinesePunctuationToEnglish')
    const insertSpaceOptions = this.options.getByKey('content.insertSpace')

    const matchedOriginal = matchLyric(original, replaceOptions.original)
    const matchedDynamic = matchLyric(dynamic, replaceOptions.dynamic)
    if (!matchedDynamic && !matchedOriginal) return null

    const [targetLyric, targetMatched] = matchedDynamic
      ? [this.line.parseDynamic(matchedDynamic.lines), matchedDynamic]
      : matchedOriginal
      ? [this.line.parseNormal(matchedOriginal.lines), matchedOriginal]
      : [null, null]
    if (!targetLyric) return null

    const [targetMeta, targetLines] = this.meta.parse(targetMatched.metas, targetLyric.lines)
    targetLyric.lines = targetLines

    if (!targetLyric.config.isSupportAutoScroll && targetMeta) {
      targetLyric.meta = targetMeta
      return targetLyric
    }

    const matchedTranslate = matchLyric(translate, replaceOptions.translate)
    const targetTranslate = matchedTranslate && this.line.parseNormal(matchedTranslate.lines)

    const matchedRoman = matchLyric(roman, replaceOptions.roman)
    const targetRoman = matchedRoman && this.line.parseNormal(matchedRoman.lines)

    const aligndTranslate = targetTranslate ? alignLyricWithTime({ base: targetLyric.lines, target: targetTranslate.lines }) : null
    const aligndRoman = targetRoman ? alignLyricWithTime({ base: targetLyric.lines, target: targetRoman.lines }) : null

    const resultLyric = { ...targetLyric }
    for (const line of resultLyric.lines) {
      if (aligndTranslate) {
        const target = aligndTranslate.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
        if (target) line.content.translated = target.content.original
      }
      if (aligndRoman) {
        const target = aligndRoman.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
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

    resultLyric.lines = insertSpaceForLines(insertSpaceOptions, resultLyric.lines)
    resultLyric.lines = resultLyric.lines.sort((a, b) => a.time.start - b.time.start)

    if (targetMeta) {
      resultLyric.meta = targetMeta
    }

    return resultLyric
  }
}
