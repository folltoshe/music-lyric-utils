import type { Lyric } from '@music-lyric-utils/shared'
import type { ParserOptionsWithManager, RequiredParserOptions } from '@root/types'

import { DEFAULT_PARSER_OPTIONS } from '@root/constant/options'

import { ParsedLyricLine, parseTime } from '@root/utils'

const LYRIC_META_REGEXP = /^\s*\[\s*(?<key>[A-Za-z0-9_-]+)\s*:\s*(?<value>[^\]]*)\s*\]\s*$/

export class BaseParser {
  private rule: RequiredParserOptions['meta']['name']['split']['rule'] = DEFAULT_PARSER_OPTIONS.meta.name.split.rule

  constructor(protected options: ParserOptionsWithManager) {
    this.options.on('config-update', this.onConfigUpdate.bind(this))
    this.onConfigUpdate()
  }

  private onConfigUpdate() {
    this.rule = this.options.getByKey('meta.name.split.rule')
  }

  private processName(name: string, rule?: string | RegExp) {
    const target = rule || this.rule.common
    return name
      .split(target)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  parseItem(target: Lyric.Meta.Info, key: string, value: string) {
    switch (key) {
      case 'offset':
        target.offset = Number(value) || 0
        break
      case 'ti':
      case 'title':
        target.title = value
        break
      case 'ar':
      case 'artist':
        target.artist = {
          raw: value,
          parsed: this.processName(value, this.rule.artist),
        }
        break
      case 'al':
      case 'album':
        target.album = value
        break
      case 'au':
      case 'author':
        target.author = {
          raw: value,
          parsed: this.processName(value, this.rule.author),
        }
        break
      case 'lr':
      case 'lyricist':
        target.lyricist = {
          raw: value,
          parsed: this.processName(value, this.rule.lyricist),
        }
        break
      case 'length':
      case 'duration':
        target.duration = {
          raw: value,
          parsed: parseTime(value) || 0,
        }
        break
      case 'by':
      case 'contributor':
        target.contributor = {
          raw: value,
          parsed: this.processName(value, this.rule.contributor),
        }
        target
    }
  }

  parse(lines: ParsedLyricLine[]) {
    const result: Lyric.Meta.Info = { offset: 0 }

    for (const meta of lines) {
      if (!meta.tag) continue

      const matched = meta.tag.match(LYRIC_META_REGEXP)
      if (!matched || !matched.groups) continue

      const key = (matched.groups.key || '').trim().toLowerCase()
      const value = (matched.groups.value || '').trim()
      if (!key || !value) continue

      this.parseItem(result, key, value)
    }

    return result
  }
}
