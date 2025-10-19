import type { Lyric } from '@music-lyric-utils/shared'
import type { Context, MusicInfoProps } from '@root/types'

import { PURIFICATION_MATCH_MODE, DEFAULT_PURIFICATION_RULES, DEFAULT_PURIFICATION_RULES_QUICK_KEYWORDS } from '@root/constant'

import { matchTextIsValid, matchTextWithPercentage } from '@music-lyric-utils/shared'

const handleProcessName = (content: string) => {
  return content.replaceAll(/\s/g, '').trim().toLowerCase()
}

const handleProcessMusicInfoRules = (musicInfo: MusicInfoProps) => {
  return [handleProcessName(musicInfo.name), ...musicInfo.singer.map((item) => handleProcessName(item))]
}

export const purificationLyric = (context: Context, info: Lyric.Info, key: Lyric.Line.ContentKey, musicInfo?: MusicInfoProps) => {
  const options = context.options.getByKey(`content.normal.${key}.purification`)
  if (!options.enable) {
    return info
  }

  if (key === 'dynamic') {
    return info
  }

  const result = info
  const lines: Lyric.Line.Info[] = []

  const handleMatched = (line: Lyric.Line.Info) => {
    switch (key) {
      case 'original':
        break
      default:
        delete line.content[key]
        lines.push(line)
        break
    }
  }

  const matchRules = [...(options.match.rule.useDefault ? DEFAULT_PURIFICATION_RULES : []), ...options.match.rule.custom]
  for (let index = 0; index < info.lines.length; index++) {
    const line = info.lines[index]

    const content = line.content[key]
    if (!content) {
      lines.push(line)
      continue
    }

    const isFirstLine = index === 0
    const extraRules = isFirstLine && musicInfo && options.firstLine.useMusicInfo ? handleProcessMusicInfoRules(musicInfo) : []
    const targetRules = [...matchRules, ...extraRules]

    if (options.match.mode === PURIFICATION_MATCH_MODE.EXACT) {
      const percentage = matchTextWithPercentage(content, targetRules)
      const check = isFirstLine ? options.firstLine.exact.check.percentage : options.match.exact.check.percentage
      if (percentage > check) {
        handleMatched(line)
        continue
      }
    } else {
      const isMatch = matchTextIsValid(content, targetRules, DEFAULT_PURIFICATION_RULES_QUICK_KEYWORDS)
      if (isMatch) {
        handleMatched(line)
        continue
      }
    }

    lines.push(line)
  }

  result.lines = lines
  return result
}
