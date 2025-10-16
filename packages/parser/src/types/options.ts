import type { DeepRequired, InsertTextSpaceTypes, OptionsManager } from '@music-lyric-utils/shared'

export interface ContentNormalOptions {
  replace?: {
    /**
     * replace chinese punctuation to english
     */
    punctuation?: boolean
  }
  insert?: {
    /**
     * insert space
     */
    space?: {
      /**
       * @default true
       */
      enable?: boolean
      /**
       * @default TextSpacerProcessType.ALL
       */
      types?: InsertTextSpaceTypes[]
    }
  }
}

export type ContentNormalOptionsRequired = DeepRequired<ContentNormalOptions>

export interface ParserOptions {
  meta?: {
    tag?: {
      /**
       * @default true
       */
      enable?: boolean
      /**
       * people name
       */
      name?: {
        split?: {
          /**
           * @default "/"
           */
          rule?: string | RegExp
        }
      }
    }
    producer?: {
      /**
       * @default true
       */
      enable?: boolean
      /**
       * @default true
       */
      replace?: boolean
      /**
       * only when it is matched will it be used as the correct role
       */
      match?: {
        rule?: {
          /**
           * is use default rule
           * @default true
           */
          useDefault?: boolean
          /**
           * custom rule, it will be merge with default when useDefault is enable
           * @default []
           */
          custom?: (string | RegExp)[]
        }
      }
      /**
       * role name options
       */
      role?: {
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
        split?: {
          /**
           * @default "/"
           */
          rule?: string | RegExp
        }
      }
    }
  }
  content?: {
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
    normal?: {
      /**
       * original line
       */
      original?: ContentNormalOptions
      /**
       * dynamic line
       */
      dynamic?: ContentNormalOptions
      /**
       * translate line
       */
      translate?: ContentNormalOptions
      /**
       * roman line
       */
      roman?: ContentNormalOptions
    }
  }
}

export type ParserOptionsRequired = DeepRequired<ParserOptions>

export type ParserOptionsManager = OptionsManager<DeepRequired<ParserOptions>>
