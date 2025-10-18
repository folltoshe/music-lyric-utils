import type { Context, ParserOptions, ParserProps } from '@root/types'

import { DEFAULT_PARSER_OPTIONS } from '@root/constant'

import { OptionsManager } from '@music-lyric-utils/shared'

// pre match
import { matchLyric } from './match'
// line process
import { processLyric } from './line'
import { processMeta } from './meta'
// extra process
import { insertInterlude } from './extra'

export class LyricParser {
  private context: Context

  constructor(opt?: ParserOptions) {
    this.context = {
      options: new OptionsManager(DEFAULT_PARSER_OPTIONS),
    }

    if (opt) {
      this.context.options.updateAll(opt)
    }
  }

  parse(props: ParserProps) {
    const [original, dynamic, translate, roman] = [matchLyric(props.original), matchLyric(props.dynamic), matchLyric(props.translate), matchLyric(props.roman)]

    let target = processLyric(this.context, { original, dynamic, translate, roman })
    if (!target) {
      return null
    }

    // process meta
    target = processMeta(this.context, original.meta, target)
    // insert interlude
    target = insertInterlude(this.context, target)

    return target
  }
}
