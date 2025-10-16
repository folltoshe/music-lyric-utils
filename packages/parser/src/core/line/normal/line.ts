import type { Lyric } from '@music-lyric-utils/shared'
import type { ContentNormalOptionsRequired, MatchItem } from '@root/types'

import { cloneDeep, EMPTY_LYRIC_LINE } from '@music-lyric-utils/shared'

import { insertSpace } from '@music-lyric-utils/shared'
import { parseTagTime } from '@root/utils'

export const processLine = (options: ContentNormalOptionsRequired, line: MatchItem) => {
  const time = parseTagTime(line.tag) || 0
  const text = options.insert.space.enable ? insertSpace(line.content, options.insert.space.types).trim() : line.content.trim()

  const result: Lyric.Line.Info = cloneDeep(EMPTY_LYRIC_LINE)
  result.time.start = time
  result.content.original = text

  return result
}
