import type { RequiredParserOptions } from '../interface'

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
  match: {
    producers: {
      enable: true,
      replace: true,
      role: {
        match: {
          rule: [],
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
} as const
