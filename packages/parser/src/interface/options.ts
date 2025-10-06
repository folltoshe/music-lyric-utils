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
  content?: {
    replace?: {
      /**
       * replace chinese punctuation to english
       */
      chinesePunctuationToEnglish?: {
        /**
         * @default true
         */
        original?: boolean
        /**
         * @default true
         */
        translate?: boolean
        /**
         * @default false
         */
        roman?: boolean
        /**
         * @default true
         */
        dynamic?: boolean
      }
      /**
       * insert space to some punctuation
       */
      insertSpaceToPunctuation?: boolean
    }
  }
  match?: {
    /**
     * match producers from lyric
     */
    producers?: {
      /**
       * @default true
       */
      enable?: boolean
      /**
       * @default true
       */
      replace?: boolean
      /**
       * role name options
       */
      role?: {
        /**
         * only when it is matched will it be used as the correct role
         */
        match?: {
          /**
           * @default
           */
          rule?: (string | RegExp)[]
        }
        /**
         * replace from raw text
         */
        replace?: {
          /**
           * @default true
           */
          enable?: boolean
          /**
           * @default "by"
           */
          rule?: (string | RegExp)[]
        }
      }
      /**
       * people name options
       */
      name?: {
        /**
         * people name split options
         */
        split?: {
          /**
           * @default "/"
           */
          rule?: string | RegExp
        }
      }
    }
  }
}

export type RequiredParserOptions = DeepRequired<ParserOptions>

export interface ParseLyricProps {
  original?: string
  translate?: string
  roman?: string
  dynamic?: string
}
