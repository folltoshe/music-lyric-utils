export interface LyricTimeInfo {
  // start time (ms)
  start: number
  // end time (ms)
  end: number
  // time duration (ms)
  duration: number
}

export interface LyricDynamicWord {
  // time info (relative to the time of this lyrics)
  time: LyricTimeInfo
  // text contents
  text: string
  // dynamic word config
  config: {
    // need space in word end
    needSpaceEnd: boolean
    // long tail sound
    needTrailing: boolean
  }
}

export interface LyricDynamicInfo {
  // time info (relative to the time of this lyrics)
  time: LyricTimeInfo
  // dynamic words
  words: LyricDynamicWord[]
}

export type LyricLineType = 'NORMAL' | 'INTERLUDE'

export interface LyricLine {
  // lyric line type
  type: LyricLineType
  // time info (relative to the time of this lyrics)
  time: LyricTimeInfo
  // line content
  content: {
    // original text
    original: string
    // translated text
    translated?: string
    // roman text
    roman?: string
    // dynamic content
    dynamic?: LyricDynamicInfo
  }
}

export interface LyricInfo {
  // lyric meta
  meta: {
    // lyric offset
    offset: number
    // lyric lines total count
    total: number
  }
  // lyric lines
  lines: LyricLine[]
  // lyric config
  config: {
    // is instrumental music (may)
    isInstrumental: boolean
    // is support auto scroll lyric (no lyric time info)
    isSupportAutoScroll: boolean
  }
}
