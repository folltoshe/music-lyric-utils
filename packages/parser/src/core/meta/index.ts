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

  parse(matched: ParsedLyricLine[], lines: LyricLine[]): [LyricMeta | null, LyricLine[]] {
    if (!this.options.getByKey('meta.enable')) return [null, lines]

    const [newLines, producers] = this.producer.parse(lines)

    const base = this.base.parse(matched)
    if (producers.length) base.producers = producers

    return [base, newLines]
  }
}
