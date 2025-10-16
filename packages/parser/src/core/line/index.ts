import { cloneDeep, type Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchInfo } from '@root/types'

import { alignLyricWithTime } from '@root/utils'

import { processDynamic } from './dynamic'
import { processNormal } from './normal'
import { insertInterlude } from './interlude'

interface Params {
  original: MatchInfo
  dynamic: MatchInfo
  translate: MatchInfo
  roman: MatchInfo
}

export class Line {
  private context: Context

  constructor(ctx: Context) {
    this.context = ctx
  }

  private checkIsValid(info: Lyric.Info) {
    return info.lines.length > 0
  }

  parse(params: Params) {
    const original = processNormal(this.context, 'original', params.original.line)
    if (!original || !this.checkIsValid(original)) {
      return null
    }

    const dynamic = processDynamic(this.context, params.dynamic.line)
    const target = dynamic && this.checkIsValid(dynamic) ? dynamic : original
    target.config.isSupportAutoScroll = !!target.lines.find((line) => line.time.start > 0)

    // if no time tag, skip align extended lyric
    if (!target.config.isSupportAutoScroll) {
      return target
    }

    const translate = processNormal(this.context, 'translate', params.translate.line)
    const translateAlign =
      translate && this.checkIsValid(translate)
        ? alignLyricWithTime({
            base: target.lines,
            target: translate.lines,
          })
        : null

    const roman = processNormal(this.context, 'roman', params.roman.line)
    const romanAlign =
      roman && this.checkIsValid(roman)
        ? alignLyricWithTime({
            base: target.lines,
            target: roman.lines,
          })
        : null

    for (const line of target.lines) {
      if (translateAlign) {
        const target = translateAlign.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
        if (target) line.content.translate = target.content.original
      }
      if (romanAlign) {
        const target = romanAlign.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
        if (target) line.content.roman = target.content.original
      }
    }

    target.lines = target.lines.sort((a, b) => a.time.start - b.time.start)
    return target
  }

  insertInterlude(lyric: Lyric.Info) {
    const result = insertInterlude(this.context, lyric)
    result.lines = result.lines.sort((a, b) => a.time.start - b.time.start)
    return result
  }
}
