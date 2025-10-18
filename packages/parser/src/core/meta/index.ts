import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { processTag } from './tag'
import { processProducer } from './producer'

export const processMeta = (context: Context, metas: MatchItem[], lyric: Lyric.Info) => {
  const [lines, producer] = processProducer(context, lyric.lines)

  const meta = processTag(context, metas)
  meta.producer = producer

  const result = lyric
  result.lines = lines
  result.meta = meta

  return result
}
