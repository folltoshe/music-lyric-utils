import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MatchItem } from '@root/types'

import { parseTime, splitNameWithRule } from '@root/utils'

const processItem = (target: Lyric.Meta.Info, key: string, value: string, rule: string | RegExp) => {
  switch (key) {
    case 'offset':
      target.offset = Number(value) || 0
      break
    case 'ti':
    case 'title':
      target.title = value
      break
    case 'ar':
    case 'artist':
      target.artist = {
        raw: value,
        parsed: splitNameWithRule(value, rule),
      }
      break
    case 'al':
    case 'album':
      target.album = value
      break
    case 'au':
    case 'author':
      target.author = {
        raw: value,
        parsed: splitNameWithRule(value, rule),
      }
      break
    case 'lr':
    case 'lyricist':
      target.lyricist = {
        raw: value,
        parsed: splitNameWithRule(value, rule),
      }
      break
    case 'length':
    case 'duration':
      target.duration = {
        raw: value,
        parsed: parseTime(value) || 0,
      }
      break
    case 'by':
    case 'contributor':
      target.contributor = {
        raw: value,
        parsed: splitNameWithRule(value, rule),
      }
      target
  }
}

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
