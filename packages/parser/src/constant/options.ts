import type { ParserOptions, ContentNormalOptionsRequired } from '@root/types/options'
import type { DeepRequired } from '@music-lyric-utils/shared'

import { INSERT_TEXT_SPACE_TYPES } from '@music-lyric-utils/shared'

const NORMAL_LINE_BASE_OPTIONS: ContentNormalOptionsRequired = {
  replace: {
    punctuation: true,
  },
  insert: {
    space: {
      enable: true,
      types: [INSERT_TEXT_SPACE_TYPES.ALL],
    },
  },
}

export const DEFAULT_PARSER_OPTIONS: DeepRequired<ParserOptions> = {
  meta: {
    tag: {
      enable: true,
      name: {
        split: {
          rule: '/',
        },
      },
    },
    producer: {
      enable: true,
      replace: true,
      match: {
        rule: {
          useDefault: true,
          custom: [],
        },
      },
      role: {
        replace: {
          enable: true,
          rule: ['by'],
        },
      },
      name: {
        split: {
          rule: /(?:[/]|[,，])/iu,
        },
      },
    },
  },
  content: {
    interlude: {
      show: true,
      checkTime: 16000,
    },
    normal: {
      original: NORMAL_LINE_BASE_OPTIONS,
      dynamic: NORMAL_LINE_BASE_OPTIONS,
      translate: NORMAL_LINE_BASE_OPTIONS,
      roman: NORMAL_LINE_BASE_OPTIONS,
    },
  },
} as const
