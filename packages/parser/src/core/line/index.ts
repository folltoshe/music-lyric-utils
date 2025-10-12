import type { ParserOptionsWithManager } from '@root/types'
import type { ParsedLyricLine } from '@root/utils'

import { NormalParser } from './normal'
import { DynamicParser } from './dynamic'

export class LineParser {
  protected normal
  protected dynamic

  constructor(protected options: ParserOptionsWithManager) {
    this.normal = new NormalParser(options)
    this.dynamic = new DynamicParser(options)
  }

  parseNormal(matched: ParsedLyricLine[]) {
    return this.normal.parse(matched)
  }

  parseDynamic(matched: ParsedLyricLine[]) {
    return this.dynamic.parse(matched)
  }
}
