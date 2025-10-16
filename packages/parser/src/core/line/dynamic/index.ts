import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'
import { processLine } from './line'

export const processDynamic = (context: Context, lines: MatchItem[]) => {
  if (lines.length <= 0) return null

  const options = context.options.getByKey('content.normal.dynamic')
  const result: Lyric.Info = cloneDeep(EMPTY_LYRIC_INFO)
  for (const line of lines) {
    const item = processLine(options, line)
    if (!item) continue
    result.lines.push(item)
  }

  return result
}
