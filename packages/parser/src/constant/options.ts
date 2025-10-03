import { type RequiredParserOptions } from '../interface'

export const PARSER_DEFAULT_OPTIONS: RequiredParserOptions = {
  interlude: {
    show: true,
    checkTime: 16000,
  },
} as const
