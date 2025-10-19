import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, ParserOptions, ParserProps } from '@root/types'

import { DEFAULT_PARSER_OPTIONS } from '@root/constant'

import { OptionsManager } from '@music-lyric-utils/shared'

import { sortLines } from '@root/utils'

// pre match
import { matchLyric } from './match'
// line process
import { processMainLyric, processExtendedLyric } from './line'
import { processMeta } from './meta'
// extra process
import { insertDuet, insertInterlude } from './extra'

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

  parse(props: ParserProps): Lyric.Info | null {
    const [original, dynamic, translate, roman] = [matchLyric(props.original), matchLyric(props.dynamic), matchLyric(props.translate), matchLyric(props.roman)]

    let target = processMainLyric(this.context, { original, dynamic })
    if (!target) {
      return null
    }

    // meta
    target = processMeta(this.context, original.meta, target)

    // duet
    target = insertDuet(this.context, target)
    // interlude
    target = insertInterlude(this.context, target)

    // sort lines
    target.lines = sortLines(target.lines)

    // extended
    target = processExtendedLyric(this.context, target, { translate, roman })

    return target
  }
}
