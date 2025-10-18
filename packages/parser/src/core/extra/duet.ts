import type { Lyric } from '@music-lyric-utils/shared'
import type { Context } from '@root/types'

import { crc32WithHex } from '@music-lyric-utils/shared'

const MATCH_REGEXP = /(?:(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\}|（[^）]*）|【[^】]*】|「[^」]*」)|[^(:：()\[\]{}（）【】「」])*?[:：]/

const createGroupId = (name: string) => {
  const target = name.replaceAll(/\s/g, '').toLowerCase()
  return crc32WithHex(target).toUpperCase()
}

export const insertDuet = (context: Context, info: Lyric.Info) => {
  const options = context.options.getByKey('content.duet')
  if (!options.insert) {
    return info
  }

  const lines: Lyric.Line.Info[] = []
  const groups: Record<string, string> = {}

  let currentGroupName = ''
  let currentGroupId = ''

  const handleAdd = (line: Lyric.Line.Info) => {
    line.group = currentGroupId
    lines.push(line)
  }

  for (const line of info.lines) {
    if (!line.content.original.trim()) {
      handleAdd(line)
      continue
    }

    const colonCount = (line.content.original.match(/[:：]/g) || []).length
    if (!colonCount) {
      handleAdd(line)
      continue
    }

    const match = MATCH_REGEXP.exec(line.content.original)
    if (!match) {
      handleAdd(line)
      continue
    }

    const colonIndex = match.index + match[0].length - 1
    const name = line.content.original.substring(0, colonIndex).trim()
    const content = line.content.original.substring(colonIndex + 1).trim()

    if (name && !content) {
      currentGroupName = name
      currentGroupId = createGroupId(name)
      if (!groups[currentGroupId]) {
        groups[currentGroupId] = currentGroupName
      }
      if (options.replace) {
        continue
      }
    }

    handleAdd(line)
  }

  const result = info

  result.groups = Object.entries(groups).map(([key, value]) => {
    return {
      id: key,
      name: value,
    }
  })
  result.lines = lines

  return result
}
