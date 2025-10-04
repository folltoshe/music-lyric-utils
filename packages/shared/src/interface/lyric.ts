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

export interface LyricProducers {
  raw: string
  role: {
    raw: string
    // replaced
    parsed: string
  }
  name: {
    raw: string
    // splitted with "/"
    parsed: string[]
  }
}

export interface LyricMeta {
  // offset of the song
  offset: number
  // title of the song
  title?: string
  // album of the song
  album?: string
  // duration of the song
  duration?: {
    raw: string
    // parsed time (ms)
    parsed: number
  }
  // artist of the song
  artist?: {
    raw: string
    // splitted with "/"
    parsed: string[]
  }
  // lyricist of the song
  lyricist?: {
    raw: string
    // splitted with "/"
    parsed: string[]
  }
  // author of the song
  author?: {
    raw: string
    // splitted with "/"
    parsed: string[]
  }
  // contributor of the lyric
  contributor?: {
    raw: string
    // splitted with "/"
    parsed: string[]
  }
  // producers of the song
  producers?: LyricProducers[]
}

export interface LyricInfo {
  // lyric meta
  meta: LyricMeta
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
