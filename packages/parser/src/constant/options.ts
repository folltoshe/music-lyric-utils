import { type RequiredParserOptions } from '../interface'

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
      insertSpaceToPunctuation: true,
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
          rule: 'by',
        },
      },
      name: {
        split: {
          rule: '/',
        },
      },
    },
  },
} as const
