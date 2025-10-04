import { type RequiredParserOptions } from '../interface'

export const PARSER_DEFAULT_OPTIONS: RequiredParserOptions = {
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
} as const
