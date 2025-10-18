import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { processTag } from './tag'
import { processProducer } from './producer'

export const processMeta = (context: Context, metas: MatchItem[], lyric: Lyric.Info) => {
  const result = processProducer(context, lyric)
  result.meta = processTag(context, metas)
  return result
}
