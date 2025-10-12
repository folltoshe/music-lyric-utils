import type { Lyric } from '@music-lyric-utils/shared'
import type { ParsedLyricLine } from '@root/utils'
import type { ParserOptionsWithManager, RequiredParserOptions } from '@root/types'

import { EMPTY_LYRIC_LINE, EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'

import { cloneDeep, insertSpace } from '@music-lyric-utils/shared'
import { parseTagTime } from '@root/utils'

export class NormalParser {
  private insertSpaceEnable: boolean = false
  private insertSpaceTypes: RequiredParserOptions['content']['insertSpace']['types'] = []

  constructor(protected options: ParserOptionsWithManager) {
    this.options.on('config-update', this.onConfigUpdate.bind(this))
  }

  private onConfigUpdate() {
    this.insertSpaceEnable = this.options.getByKey('content.insertSpace.enable')
    this.insertSpaceTypes = this.insertSpaceEnable ? this.options.getByKey('content.insertSpace.types') : []
  }

  parseLine(lineInfo: ParsedLyricLine) {
    const time = parseTagTime(lineInfo.tag) || 0
    const result = cloneDeep(EMPTY_LYRIC_LINE)
    result.time.start = time
    result.content.original = this.insertSpaceEnable ? insertSpace(lineInfo.content, this.insertSpaceTypes) : lineInfo.content
    return result
  }

  parse(matched: ParsedLyricLine[]) {
    const result: Lyric.Info = cloneDeep(EMPTY_LYRIC_INFO)

    const lines: Lyric.Line.Info[] = []
    for (const line of matched) {
      const item = this.parseLine(line)
      if (!item) continue
      lines.push(item)
    }

    for (let index = 0; index < lines.length; index++) {
      const current = lines[index]
      const next = lines[index + 1]
      if (!next) continue
      const currentDuration = next.time.start - current.time.start
      current.time.duration = currentDuration
      current.time.end = next.time.start
    }

    result.config.isSupportAutoScroll = !!lines.find((line) => line.time.start > 0)
    result.lines = lines

    return result
  }
}
