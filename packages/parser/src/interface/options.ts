import type { DeepRequired } from '@music-lyric-utils/shared'

export interface ParserOptions {
  meta?: {
    name?: {
      split?: {
        /**
         * meta split rule
         * @default "/"
         */
        rule?: {
          common?: string | RegExp
          title?: string | RegExp
          artist?: string | RegExp
          author?: string | RegExp
          lyricist?: string | RegExp
          contributor?: string | RegExp
        }
      }
    }
  }
  interlude?: {
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
