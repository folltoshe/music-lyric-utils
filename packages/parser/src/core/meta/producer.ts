import type { ParserOptionsWithManager } from '@root/interface'
import type { LyricLine, LyricProducers } from '@music-lyric-utils/shared'

import { DEFAULT_PRODUCER_RULES, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS } from '@root/constant/producer'

import { matchTextIsValid, replaceFromText } from '@music-lyric-utils/shared'

const MATCH_REGEXP = /(?:(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|（[^）]*）|【[^】]*】|「[^」]*」)|[^(:：()\[\]{}（）【】「」])*?[:：]/

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
    const options = this.options.getByKey('meta.producers')

    this.isEnable = options.enable
    this.isReplaceLine = options.replace

    const roleMatchCustomRules = options.role.match.rule.custom
    this.roleMatchRules = [...(options.role.match.rule.useDefault ? DEFAULT_PRODUCER_RULES : []), ...roleMatchCustomRules]
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
      if (!line.content.original.trim()) continue

      const colonCount = (line.content.original.match(/[:：]/g) || []).length
      if (!colonCount) continue

      const match = MATCH_REGEXP.exec(line.content.original)
      if (!match) continue

      const colonIndex = match.index + match[0].length - 1
      const role = line.content.original.substring(0, colonIndex).trim()
      const name = line.content.original.substring(colonIndex + 1).trim()

      if (!role || !name) {
        resultLines.push(line)
        continue
      }

      const isMatch = matchTextIsValid(role, this.roleMatchRules, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS)
      if (!isMatch) {
        resultLines.push(line)
        continue
      }

      const item: LyricProducers = {
        raw: line.content.original,
        role: {
          raw: role,
          parsed: this.roleEnableReplace ? replaceFromText(role, '', this.roleReplaceRules).trim() : role,
        },
        name: {
          raw: name,
          parsed: this.processName(name),
        },
      }
      result.push(item)

      if (!this.isReplaceLine) resultLines.push(line)
    }

    return [resultLines, result]
  }
}
