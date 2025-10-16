import type { Lyric } from '@music-lyric-utils/shared'

import { parseTime } from '@root/utils'
import { processName } from './utils'

export const processItem = (target: Lyric.Meta.Info, key: string, value: string, rule: string | RegExp) => {
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
        parsed: processName(value, rule),
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
        parsed: processName(value, rule),
      }
      break
    case 'lr':
    case 'lyricist':
      target.lyricist = {
        raw: value,
        parsed: processName(value, rule),
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
        parsed: processName(value, rule),
      }
      target
  }
}
