import type { DeepRequired } from '@music-lyric-utils/shared'

export interface ParserOptions {
  interlude: {
    /**
     * is show interlude line
     * @default true
     */
    show?: boolean
    /**
     * If the interval between lyrics lines exceeds this number, it is considered an interlude
     * @default 16000
     */
    checkTime?: number
  }
}

export type RequiredParserOptions = DeepRequired<ParserOptions>

export interface ParseLyricProps {
  original?: string
  translate?: string
  roman?: string
  dynamic?: string
}
