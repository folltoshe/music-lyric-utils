import type { Lyric } from '@root/types'

export const LYRIC_LINE_TYPES: Record<Lyric.Line.Type, Lyric.Line.Type> = {
  NORMAL: 'NORMAL',
  INTERLUDE: 'INTERLUDE',
} as const

export const EMPTY_LYRIC_TIME_INFO: Lyric.Time = {
  start: 0,
  end: 0,
  duration: 0,
} as const

export const EMPTY_LYRIC_DYNAMIC_WORD: Lyric.Line.Dynamic.Word = {
  time: EMPTY_LYRIC_TIME_INFO,
  text: '',
  config: {
    needSpaceEnd: false,
    needTrailing: false,
  },
} as const

export const EMPTY_LYRIC_DYNAMIC_INFO: Lyric.Line.Dynamic.Info = {
  time: EMPTY_LYRIC_TIME_INFO,
  words: [],
} as const

export const EMPTY_LYRIC_INFO: Lyric.Info = {
  meta: {
    offset: 0,
  },
  lines: [],
  config: {
    isInstrumental: false,
    isSupportAutoScroll: false,
  },
} as const

export const EMPTY_LYRIC_LINE: Lyric.Line.Info = {
  type: LYRIC_LINE_TYPES.NORMAL,
  time: EMPTY_LYRIC_TIME_INFO,
  content: {
    original: '',
  },
} as const
