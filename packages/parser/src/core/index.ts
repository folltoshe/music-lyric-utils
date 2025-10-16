import type { Context, ParserOptions, ParserProps } from '@root/types'

import { DEFAULT_PARSER_OPTIONS } from '@root/constant'

import { OptionsManager } from '@music-lyric-utils/shared'

import { Matcher } from './match'
import { Line } from './line'
import { Meta } from './meta'

export class LyricParser {
  private context: Context

  private matcher: Matcher

  private line: Line
  private meta: Meta

  constructor(opt?: ParserOptions) {
    this.context = {
      options: new OptionsManager(DEFAULT_PARSER_OPTIONS),
    }

    this.matcher = new Matcher(this.context)

    this.line = new Line(this.context)
    this.meta = new Meta(this.context)

    if (opt) {
      this.context.options.updateAll(opt)
    }
  }

  parse(props: ParserProps) {
    const original = this.matcher.parse(props.original)
    const dynamic = this.matcher.parse(props.dynamic)
    const translate = this.matcher.parse(props.translate)
    const roman = this.matcher.parse(props.roman)

    let target = this.line.parse({ original, dynamic, translate, roman })
    if (!target) {
      return null
    }

    // parse meta tag
    target = this.meta.parseTag(target, original.meta)
    // parse producer
    target = this.meta.parseProducer(target)

    // insert interlude
    target = this.line.insertInterlude(target)

    return target
  }
}
