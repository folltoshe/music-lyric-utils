import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { processTag } from './tag'
import { processProducer } from './producer'

export class Meta {
  private context: Context

  constructor(ctx: Context) {
    this.context = ctx
  }

  parseTag(lyric: Lyric.Info, metas: MatchItem[]) {
    const result = processTag(this.context, metas)
    lyric.meta = result
    return lyric
  }

  parseProducer(lyric: Lyric.Info) {
    return processProducer(this.context, lyric)
  }
}
