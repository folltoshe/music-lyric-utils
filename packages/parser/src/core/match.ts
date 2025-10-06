import type { ParsedLyricLine } from '../utils'

import { replaceChinesePunctuationToEnglish } from '@music-lyric-utils/shared'
import { parseLyricLine } from '../utils'

export interface MatchedLyric {
  metas: ParsedLyricLine[]
  lines: ParsedLyricLine[]
}

export const matchLyric = (lyric: string, replacePunctuation: boolean = false): MatchedLyric | null => {
  if (!lyric.trim().length) return null

  const metas = []
  const lines = []

  for (const line of lyric.split('\n')) {
    const result = parseLyricLine(line)
    for (const parsed of result) {
      if (!parsed.tag) continue
      if (!parsed.content) metas.push(parsed)
      else {
        if (replacePunctuation) parsed.content = replaceChinesePunctuationToEnglish(parsed.content)
        lines.push(parsed)
      }
    }
  }

  return { metas, lines }
}
