import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'
import { processLine } from './line'

export const processNormal = (context: Context, key: Lyric.Line.ContentKey, lines: MatchItem[]) => {
  if (lines.length <= 0) return null

  const options = context.options.getByKey(`content.normal.${key}`)
  const result: Lyric.Info = cloneDeep(EMPTY_LYRIC_INFO)
  for (const line of lines) {
    const item = processLine(options, line)
    if (!item) continue
    result.lines.push(item)
  }

  for (let index = 0; index < result.lines.length; index++) {
    const current = result.lines[index]
    const next = result.lines[index + 1]
    if (!next) continue
    const currentDuration = next.time.start - current.time.start
    current.time.duration = currentDuration
    current.time.end = next.time.start
  }

  return result
}
