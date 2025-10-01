import type { LyricTimeInfo, LyricLineType, LyricInfo, LyricLine, LyricDynamicInfo, LyricDynamicWord } from '../interface'

export const LYRIC_LINE_TYPES: Record<LyricLineType, LyricLineType> = {
  NORMAL: 'NORMAL',
  INTERLUDE: 'INTERLUDE',
} as const

export const EMPTY_LYRIC_TIME_INFO: LyricTimeInfo = {
  start: 0,
  end: 0,
  duration: 0,
}

export const EMPTY_LYRIC_DYNAMIC_WORD: LyricDynamicWord = {
  time: EMPTY_LYRIC_TIME_INFO,
  text: '',
  config: {
    needSpaceEnd: false,
    needTrailing: false,
  },
}

export const EMPTY_LYRIC_DYNAMIC_INFO: LyricDynamicInfo = {
  time: EMPTY_LYRIC_TIME_INFO,
  words: [],
}

export const EMPTY_LYRIC_INFO: LyricInfo = {
  meta: {
    offset: 0,
    total: 0,
  },
  lines: [],
  config: {
    isInstrumental: false,
    isSupportAutoScroll: false,
  },
} as const

export const EMPTY_LYRIC_LINE: LyricLine = {
  type: LYRIC_LINE_TYPES.NORMAL,
  time: EMPTY_LYRIC_TIME_INFO,
  content: {
    original: '',
  },
} as const
