import type { Lyric } from '@music-lyric-utils/shared'
import type { ContentNormalOptionsRequired, Context, MusicInfoProps } from '@root/types'

import { matchTextWithPercentage } from '@music-lyric-utils/shared'

const handleProcessName = (content: string) => {
  return content.replaceAll(/\s/g, '').trim().toLowerCase()
}

const handlePurification = (
  context: Context,
  index: number,
  content: string,
  options: ContentNormalOptionsRequired['purification'],
  musicInfo?: MusicInfoProps
) => {
  if (!options.enable) {
    return false
  }

  if (!content) {
    return false
  }

  if (musicInfo && index === 0 && options.firstLine.enable) {
    const percentage = matchTextWithPercentage(content, [handleProcessName(musicInfo.name), ...musicInfo.singer.map((item) => handleProcessName(item))])
    if (percentage > options.firstLine.checkPercentage) {
      return true
    }
  }
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

  for (let index = 0; index < info.lines.length; index++) {
    const line = info.lines[index]

    const content = line.content[key]
    if (!content) continue

    const target = handlePurification(context, index, content, options, musicInfo)
    if (!target) {
      lines.push(line)
      continue
    }

    switch (key) {
      case 'original':
        continue
      default:
        delete line.content[key]
        lines.push(line)
        continue
    }
  }

  result.lines = lines
  return result
}
