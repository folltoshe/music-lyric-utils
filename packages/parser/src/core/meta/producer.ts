import type { Lyric } from '@music-lyric-utils/shared'
import type { Context } from '@root/types'

import { DEFAULT_PRODUCER_RULES, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS, PRODUCER_MATCH_MODE } from '@root/constant/producer'

import { matchTextIsValid, matchTextWithPercentage, replaceFromText } from '@music-lyric-utils/shared'
import { splitNameWithRule } from '@root/utils'

const MATCH_REGEXP = /(?:(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|（[^）]*）|【[^】]*】|「[^」]*」)|[^(:：()\[\]{}（）【】「」])*?[:：]/

export const processProducer = (context: Context, lyric: Lyric.Info) => {
  const options = context.options.getByKey('meta.producer')
  if (!options.enable) {
    return lyric
  }

  const target = lyric
  const result: Lyric.Meta.Producer[] = []
  const lines: Lyric.Line.Info[] = []

  const needReplace = options.replace
  const matchRules = [...(options.match.rule.useDefault ? DEFAULT_PRODUCER_RULES : []), ...options.match.rule.custom]
  for (const line of lyric.lines) {
    if (!line.content.original.trim()) {
      lines.push(line)
      continue
    }

    const colonCount = (line.content.original.match(/[:：]/g) || []).length
    if (!colonCount) {
      lines.push(line)
      continue
    }

    const match = MATCH_REGEXP.exec(line.content.original)
    if (!match) {
      lines.push(line)
      continue
    }

    const colonIndex = match.index + match[0].length - 1
    const role = line.content.original.substring(0, colonIndex).trim()
    const name = line.content.original.substring(colonIndex + 1).trim()

    if (!role || !name) {
      lines.push(line)
      continue
    }

    if (options.match.mode === PRODUCER_MATCH_MODE.EXACT) {
      const percentage = matchTextWithPercentage(role, matchRules)
      if (percentage < options.match.exact.checkPercentage) {
        lines.push(line)
        continue
      }
    } else {
      const isMatch = matchTextIsValid(role, matchRules, DEFAULT_PRODUCER_RULES_QUICK_KEYWORDS)
      if (!isMatch) {
        lines.push(line)
        continue
      }
    }

    const item: Lyric.Meta.Producer = {
      role: {
        raw: role,
        parsed: options.role.replace.enable ? replaceFromText(role, '', options.role.replace.rule).trim() : role,
      },
      name: {
        raw: name,
        parsed: splitNameWithRule(name, options.name.split.rule),
      },
    }
    result.push(item)

    if (!needReplace) lines.push(line)
  }

  target.meta.producer = result
  target.lines = lines

  return target
}
