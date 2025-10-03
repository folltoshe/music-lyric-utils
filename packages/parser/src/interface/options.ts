import type { DeepRequired } from '@music-lyric-utils/shared'

export interface ParserOptions {
  /**
   * is show interlude line
   */
  isShowInterlude?: boolean
  /**
   * If the interval between lyrics lines exceeds this number, it is considered an interlude
   */
  checkInterludeTime?: number
}

export type RequiredParserOptions = DeepRequired<ParserOptions>

export interface ParseLyricProps {
  original?: string
  translate?: string
  roman?: string
  dynamic?: string
}
