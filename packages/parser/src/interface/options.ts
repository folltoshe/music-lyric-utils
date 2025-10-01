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

export type RequiredParserOptions = Required<ParserOptions>

export interface ParseLyricProps {
  original?: string
  translate?: string
  roman?: string
  dynamic?: string
}
