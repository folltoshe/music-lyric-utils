import type { Lyric } from '@music-lyric-utils/shared'
import type { Context } from '@root/types'

import { EMPTY_LYRIC_LINE, LYRIC_LINE_TYPES } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'

export const insertInterlude = (context: Context, info: Lyric.Info) => {
  const options = context.options.getByKey('content.interlude')
  if (!options.show) {
    return info
  }

  const result = info
  const length = info.lines.length
  for (let index = 0; index < length; index++) {
    const current = info.lines[index]
    const next = info.lines[index + 1]

    // add interlude when first line is time too long
    if (index === 0 && current.time.start > options.firstLineCheckTime) {
      const line = cloneDeep(EMPTY_LYRIC_LINE)
      const start = 500
      const duration = current.time.start - start
      const end = current.time.start + duration
      line.time = { start, end, duration }
      line.type = LYRIC_LINE_TYPES.INTERLUDE
      result.lines.push(line)
      continue
    }

    // add interlude
    if (next && next.time.start - current.time.end > options.checkTime) {
      const line = cloneDeep(EMPTY_LYRIC_LINE)
      const start = current.time.end + 100
      const duration = Math.max(next.time.start - start, 0)
      const end = current.time.end + duration
      line.time = { start, end, duration }
      line.type = LYRIC_LINE_TYPES.INTERLUDE
      result.lines.push(line)
    }
  }

  return result
}
