import type { ParserOptionsWithManager } from '@root/interface'
import type { LyricLine, LyricProducers } from '@music-lyric-utils/shared'

import { DEFAULT_PRODUCER_RULES, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS } from '@root/constant/producer'

import { matchTextIsValid, replaceFromText } from '@music-lyric-utils/shared'

export class ProducerParser {
  private isEnable = false
  private isReplaceLine = false

  private roleEnableReplace = false
  private roleReplaceRules: (string | RegExp)[] = []
  private roleMatchRules: (string | RegExp)[] = []

  private nameSplitRule: string | RegExp = ''

  constructor(protected options: ParserOptionsWithManager) {
    this.options.on('config-update', this.onConfigUpdate.bind(this))
    this.onConfigUpdate()
  }

  private onConfigUpdate() {
    const options = this.options.getByKey('match.producers')

    this.isEnable = options.enable
    this.isReplaceLine = options.replace

    const roleMatchCustomRules = options.role.match.rule
    this.roleMatchRules = [...(options.role.match.useDefault ? DEFAULT_PRODUCER_RULES : []), ...roleMatchCustomRules]
    this.roleReplaceRules = options.role.replace.rule

    this.nameSplitRule = options.name.split.rule
  }

  private processName(name: string) {
    return name
      .split(this.nameSplitRule)
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  parse(lines: LyricLine[]): [LyricLine[], LyricProducers[]] {
    if (!this.isEnable) [lines, []]

    const resultLines: LyricLine[] = []
    const result: LyricProducers[] = []

    for (const line of lines) {
      const [roleRaw, nameRaw] = line.content.original.split(/[：︰:]/)

      const roleTrim = roleRaw?.trim()
      const nameTrim = nameRaw?.trim()

      if (!roleTrim || !nameTrim) {
        resultLines.push(line)
        continue
      }

      const isMatch = matchTextIsValid(roleTrim, this.roleMatchRules, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS)
      if (!isMatch) {
        resultLines.push(line)
        continue
      }

      const item: LyricProducers = {
        raw: line.content.original,
        role: {
          raw: roleTrim,
          parsed: this.roleEnableReplace ? replaceFromText(roleTrim, '', this.roleReplaceRules).trim() : roleTrim,
        },
        name: {
          raw: nameTrim,
          parsed: this.processName(nameTrim),
        },
      }
      result.push(item)

      if (!this.isReplaceLine) resultLines.push(line)
    }

    return [resultLines, result]
  }
}
