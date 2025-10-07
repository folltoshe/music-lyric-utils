import type { LyricLine, LyricMeta } from '@music-lyric-utils/shared'
import type { ParserOptionsWithManager } from '@root/interface'
import type { ParsedLyricLine } from '@root/utils'

import { BaseParser } from './base'
import { ProducerParser } from './producer'

export class MetaParser {
  protected base
  protected producer

  constructor(protected options: ParserOptionsWithManager) {
    this.base = new BaseParser(options)
    this.producer = new ProducerParser(options)
  }

  parseBase(matched: ParsedLyricLine[]) {
    return this.base.parse(matched)
  }

  parseProducer(lines: LyricLine[]) {
    return this.producer.parse(lines)
  }

  parse(matched: ParsedLyricLine[], lines: LyricLine[]): [LyricMeta, LyricLine[]] {
    const [newLines, producers] = this.parseProducer(lines)

    const base = this.parseBase(matched)
    if (producers.length) base.producers = producers

    return [base, newLines]
  }
}
