import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchInfo } from '@root/types'

import { EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'
import { alignLyricWithTime, sortLines } from '@root/utils'

import { processDynamic } from './dynamic'
import { processNormal } from './normal'

const checkIsValid = (lines: Lyric.Line.Info[]) => {
  return lines.length > 0
}

interface MainParams {
  original: MatchInfo
  dynamic: MatchInfo
}

export const processMainLyric = (context: Context, params: MainParams) => {
  const original = processNormal(context, 'original', params.original.line)
  if (!original || !checkIsValid(original)) {
    return null
  }

  const dynamic = processDynamic(context, params.dynamic.line)

  const target = dynamic && checkIsValid(dynamic) ? dynamic : original
  const result: Lyric.Info = cloneDeep(EMPTY_LYRIC_INFO)

  const isSupportAutoScroll = !!target.find((line) => line.time.start > 0)
  result.config.isSupportAutoScroll = isSupportAutoScroll

  // if no time tag, skip align extended lyric
  if (!isSupportAutoScroll) {
    result.lines = target
    return result
  }

  result.lines = sortLines(target)
  return result
}

interface ExtendedParams {
  translate: MatchInfo
  roman: MatchInfo
}

export const processExtendedLyric = (context: Context, info: Lyric.Info, params: ExtendedParams) => {
  if (!info.config.isSupportAutoScroll) {
    return info
  }

  const result = info
  const target = info.lines

  const translate = processNormal(context, 'translate', params.translate.line)
  const translateAlign =
    translate && checkIsValid(translate)
      ? alignLyricWithTime({
          base: target,
          target: translate,
        })
      : null

  const roman = processNormal(context, 'roman', params.roman.line)
  const romanAlign =
    roman && checkIsValid(roman)
      ? alignLyricWithTime({
          base: target,
          target: roman,
        })
      : null

  for (const line of target) {
    if (translateAlign) {
      const target = translateAlign.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
      if (target) line.content.translate = target.content.original
    }
    if (romanAlign) {
      const target = romanAlign.find((v) => v.time.start === line.time.start) as Lyric.Line.Info
      if (target) line.content.roman = target.content.original
    }
  }

  result.lines = target
  return result
}
