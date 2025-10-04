import type { LyricMeta } from '@music-lyric-utils/shared'
import type { ParsedLyricLine } from '../utils'

import { parseTime } from '../utils'

const LYRIC_META_REGEXP = /^\s*\[\s*(?<key>[A-Za-z0-9_-]+)\s*:\s*(?<value>[^\]]*)\s*\]\s*$/

const handleProcessName = (name: string) => {
  return name.split('/').map((item) => item.trim())
}

export const processLyricMeta = (matchedMetas: ParsedLyricLine[]) => {
  const result: LyricMeta = { offset: 0 }

  for (const meta of matchedMetas) {
    if (!meta.tag) continue

    const matched = meta.tag.match(LYRIC_META_REGEXP)
    if (!matched || !matched.groups) continue

    const key = (matched.groups.key || '').trim().toLowerCase()
    const value = (matched.groups.value || '').trim()
    if (!key || !value) continue

    switch (key) {
      case 'offset':
        result.offset = Number(value) || 0
        continue
      case 'ti':
      case 'title':
        result.title = value
        continue
      case 'ar':
      case 'artist':
        result.artist = {
          raw: value,
          parsed: handleProcessName(value),
        }
        continue
      case 'al':
      case 'album':
        result.album = value
        continue
      case 'au':
      case 'author':
        result.author = {
          raw: value,
          parsed: handleProcessName(value),
        }
        continue
      case 'lr':
      case 'lyricist':
        result.lyricist = {
          raw: value,
          parsed: handleProcessName(value),
        }
        continue
      case 'length':
      case 'duration':
        result.duration = {
          raw: value,
          parsed: parseTime(value) || 0,
        }
        continue
      case 'by':
      case 'contributor':
        result.contributor = {
          raw: value,
          parsed: handleProcessName(value),
        }
        continue
    }
  }

  return result
}
