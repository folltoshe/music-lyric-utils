import { cloneDeep } from 'lodash'
import { type LyricInfo, type LyricLine, EMPTY_LYRIC_LINE, EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'
import { parseLyricLine, parseLyricTagTime } from '../utils'

export const processNormalLine = (line: string) => {
  const result: LyricLine[] = []
  for (const sub of parseLyricLine(line, true)) {
    const time = parseLyricTagTime(sub.tag) || 0
    const item = cloneDeep(EMPTY_LYRIC_LINE)
    item.time.start = time
    item.content.original = sub.content
    result.push(item)
  }
  return result
}

export const processNormalLyric = (lyric: string) => {
  const result: LyricInfo = cloneDeep(EMPTY_LYRIC_INFO)

  const lines: LyricLine[] = []
  for (const line of lyric.split('\n')) {
    const items = processNormalLine(line)
    lines.push(...items)
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
