import type { Context, MatchInfo, MatchItem } from '@root/types'

import { checkIsValidText } from '@music-lyric-utils/shared'

// prettier-ignore
const LINE_REGEXP = /(?<tag>\[(?:[a-zA-Z]+\s*:\s*[^\]]+|(?:\d+:)?\d+:\d+(?:\.\d+)?)\])(?<content>[\s\S]*?)(?=(?:\[(?:[a-zA-Z]+\s*:\s*[^\]]+|(?:\d+:)?\d+:\d+(?:\.\d+)?)\])|$)/g

const META_REGEX = /^\[[a-zA-Z]+:[^\]]+\]$/

const LINE_REGEX = /^\[(\d+:)?\d+:\d+(\.\d+)?\].+$/

const reomveSpace = (content: string) => {
  return content.replaceAll(/\s/g, '').trim()
}

export const checkIsValidMeta = (content: string) => {
  return META_REGEX.test(reomveSpace(content))
}

export const checkIsValidLine = (content: string) => {
  return LINE_REGEX.test(reomveSpace(content))
}

export class Matcher {
  private context: Context

  constructor(ctx: Context) {
    this.context = ctx
  }

  private matchLine(content: string) {
    const result: MatchItem[] = []

    for (const match of content.matchAll(LINE_REGEXP)) {
      const raw = match[0]
      const tag = (match.groups?.tag || '').trim()
      const content = (match.groups?.content || '').trim()

      if (!tag) continue

      const item: MatchItem = { raw, tag, content }
      result.push(item)
    }

    return result
  }

  parse(content?: string) {
    const result: MatchInfo = { line: [], meta: [] }

    if (!content || !checkIsValidText(content)) return result

    const parsed: MatchItem[] = []
    for (const line of content.split('\n')) {
      if (!line.trim()) continue
      const item = this.matchLine(line)
      parsed.push(...item)
    }

    for (const item of parsed) {
      if (checkIsValidMeta(item.raw)) {
        result.meta.push(item)
        continue
      }
      if (checkIsValidLine(item.raw)) {
        result.line.push(item)
        continue
      }
    }

    return result
  }
}
