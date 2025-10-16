import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { processItem } from './item'

const LYRIC_META_REGEXP = /^\s*\[\s*(?<key>[A-Za-z0-9_-]+)\s*:\s*(?<value>[^\]]*)\s*\]\s*$/

export const processTag = (context: Context, metas: MatchItem[]) => {
  const result: Lyric.Meta.Info = { offset: 0 }

  const options = context.options.getByKey('meta.tag')
  if (!options.enable) {
    return result
  }

  for (const meta of metas) {
    if (!meta.tag) continue

    const matched = meta.tag.match(LYRIC_META_REGEXP)
    if (!matched || !matched.groups) continue

    const key = (matched.groups.key || '').trim().toLowerCase()
    const value = (matched.groups.value || '').trim()
    if (!key || !value) continue

    processItem(result, key, value, options.name.split.rule)
  }

  return result
}
