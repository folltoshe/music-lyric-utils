import type { RequiredParserOptions } from '@root/interface'

import { INSERT_TEXT_SPACE_TYPES } from '@music-lyric-utils/shared'

export const DEFAULT_PARSER_OPTIONS: RequiredParserOptions = {
  meta: {
    name: {
      split: {
        rule: {
          common: '/',
          title: '',
          artist: '',
          author: '',
          lyricist: '',
          contributor: '',
        },
      },
    },
    producers: {
      enable: true,
      replace: true,
      role: {
        match: {
          rule: {
            useDefault: true,
            custom: [],
          },
        },
        replace: {
          enable: true,
          rule: ['by'],
        },
      },
      name: {
        split: {
          rule: /(?:[/]|[,，])/,
        },
      },
    },
  },
  interlude: {
    show: true,
    checkTime: 16000,
  },
  content: {
    replace: {
      chinesePunctuationToEnglish: {
        original: true,
        translate: true,
        roman: false,
        dynamic: true,
      },
    },
    insertSpace: {
      enable: true,
      types: [INSERT_TEXT_SPACE_TYPES.ALL],
    },
  },
} as const
