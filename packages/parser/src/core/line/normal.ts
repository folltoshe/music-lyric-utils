import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem, ContentNormalOptionsRequired } from '@root/types'

import { EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'

import { cloneDeep, insertSpace } from '@music-lyric-utils/shared'
import { parseTagTime } from '@root/utils'

const processLine = (options: ContentNormalOptionsRequired, line: MatchItem) => {
  const time = parseTagTime(line.tag) || 0
  const text = options.insert.space.enable ? insertSpace(line.content, options.insert.space.types).trim() : line.content.trim()

  const result: Lyric.Line.Info = cloneDeep(EMPTY_LYRIC_LINE)
  result.time.start = time
  result.content.original = text

  return result
}

export const processNormal = (context: Context, key: Lyric.Line.ContentKey, lines: MatchItem[]) => {
  if (lines.length <= 0) return null

  const options = context.options.getByKey(`content.normal.${key}`)
  const result: Lyric.Line.Info[] = []
  for (const line of lines) {
    const item = processLine(options, line)
    if (!item) continue
    result.push(item)
  }

  for (let index = 0; index < result.length; index++) {
    const current = result[index]
    const next = result[index + 1]
    if (!next) continue
    const currentDuration = next.time.start - current.time.start
    current.time.duration = currentDuration
    current.time.end = next.time.start
  }

  return result
}
