import type { Lyric } from '@root/types'

import { freezeDeep } from '@root/utils'

export const LYRIC_LINE_TYPES: Record<Lyric.Line.Type, Lyric.Line.Type> = {
  NORMAL: 'NORMAL',
  INTERLUDE: 'INTERLUDE',
} as const
freezeDeep(LYRIC_LINE_TYPES)

export const EMPTY_LYRIC_TIME_INFO: Lyric.Time = {
  start: 0,
  end: 0,
  duration: 0,
} as const
freezeDeep(EMPTY_LYRIC_TIME_INFO)

export const EMPTY_LYRIC_DYNAMIC_WORD: Lyric.Line.Dynamic.Word = {
  time: EMPTY_LYRIC_TIME_INFO,
  text: '',
  config: {
    needSpaceStart: false,
    needSpaceEnd: false,
    needTrailing: false,
  },
} as const
freezeDeep(EMPTY_LYRIC_DYNAMIC_WORD)

export const EMPTY_LYRIC_DYNAMIC_INFO: Lyric.Line.Dynamic.Info = {
  time: EMPTY_LYRIC_TIME_INFO,
  words: [],
} as const
freezeDeep(EMPTY_LYRIC_DYNAMIC_INFO)

export const EMPTY_LYRIC_INFO: Lyric.Info = {
  meta: {
    offset: 0,
  },
  lines: [],
  groups: [],
  config: {
    isInstrumental: false,
    isSupportAutoScroll: false,
  },
} as const
freezeDeep(EMPTY_LYRIC_INFO)

export const EMPTY_LYRIC_LINE: Lyric.Line.Info = {
  type: LYRIC_LINE_TYPES.NORMAL,
  time: EMPTY_LYRIC_TIME_INFO,
  group: {
    id: '',
    index: {
      global: 0,
      block: 0,
    },
  },
  content: {
    original: '',
  },
} as const
freezeDeep(EMPTY_LYRIC_LINE)
