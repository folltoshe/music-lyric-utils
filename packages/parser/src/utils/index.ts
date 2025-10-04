import { cloneDeep } from 'lodash'

import { type LyricTimeInfo } from '@music-lyric-utils/shared'

const LYRIC_TAG_CONTENT_REGEXP = /^[<\[]([^>\]]+)[>\]]$/
const LYRIC_TAG_TIME_REGEXP = /^(?:(?<hour>\d+):)?(?<minute>\d+):(?<second>\d+)(?:\.(?<milliSecond>\d{1,3}))?$/u
/**
 * parse lyric tag time
 * tag support format:
 *    - mm:ss
 *    - mm:ss.SSS
 *    - hh:mm:ss
 *    - hh:mm:ss.SSS
 *
 * @param tag lyric time tag, e.g. [1:14:514] or <1:14:514>
 */
export const parseLyricTagTime = (tag: string): number | null => {
  const content = tag.trim().match(LYRIC_TAG_CONTENT_REGEXP)
  if (!content) return null

  const time = content[1]?.trim().match(LYRIC_TAG_TIME_REGEXP)
  if (!time || !time.groups) return null

  const hour = parseInt(time.groups.hour, 10) || 0
  const minute = parseInt(time.groups.minute, 10) || 0
  const second = parseInt(time.groups.second, 10) || 0
  const milliSecond = parseInt(time.groups.milliSecond?.padEnd(3, '0').slice(0, 3) || '0') || 0

  return ((hour * 60 + minute) * 60 + second) * 1000 + milliSecond
}

const LYRIC_TAG_REGEXP = /(?<tag>\[[^\]]*\])(?<content>[\s\S]*?)(?=(?:\[[^\]]*\])|$)/g

export interface ParsedLyricLine {
  raw: string
  tag: string
  content: string
}

/**
 * parse lyric line meta and content
 *
 * support formats:
 *  - e.g. [1:14:514]line content
 *  - e.g. [offset:0][1:14:514]line content
 *
 * @param text raw lyric line
 * @param replaceTag need replace tag
 */
export const parseLyricLine = (text: string): ParsedLyricLine[] => {
  const result = []

  for (const match of text.matchAll(LYRIC_TAG_REGEXP)) {
    const raw = match[0]
    const tag = (match.groups?.tag || '').trim()
    const content = (match.groups?.content || '').trim()
    result.push({ raw, tag, content })
  }

  return result
}

const nearestIndex = (base: number[], time: number) => {
  let lo = 0,
    hi = base.length - 1
  if (time <= base[lo]) return lo
  if (time >= base[hi]) return hi
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1
    if (base[mid] === time) return mid
    if (base[mid] < time) lo = mid
    else hi = mid
  }
  return Math.abs(base[lo] - time) <= Math.abs(base[hi] - time) ? lo : hi
}

interface AlignLyricLine {
  time: LyricTimeInfo
  [k: string]: any
}

/**
 * align lyric to base
 */
export const alignLyricWithTime = ({
  base,
  target,
  threshold = 20,
  unique = false,
  maxDistance = Infinity,
}: {
  base: AlignLyricLine[]
  target: AlignLyricLine[]
  threshold?: number
  unique?: boolean
  maxDistance?: number
}): AlignLyricLine[] => {
  if (!base || base.length === 0 || !target || target.length === 0) {
    return target.map((t) => cloneDeep(t))
  }

  const basePairs = base.map((item, index) => ({ time: item.time, index })).sort((a, b) => a.time.start - b.time.start)
  const baseTimes = basePairs.map((item) => item.time.start)

  const assigned = new Array(baseTimes.length).fill(false)
  const result = target.map((t) => cloneDeep(t))

  const order = result.map((item, index) => ({ time: item.time, index })).sort((a, b) => a.time.start - b.time.start)
  for (const { time, index } of order) {
    const targetLine = result[index]
    const nearIndex = nearestIndex(baseTimes, time.start)
    const bestBaseTime = baseTimes[nearIndex]
    const dist = Math.abs(bestBaseTime - time.start)

    if (dist <= threshold && dist <= maxDistance) {
      targetLine.time.start = bestBaseTime
      if (unique) assigned[index] = true
      continue
    }

    // not find same time line
    if (!unique) {
      if (dist <= maxDistance) targetLine.time.start = bestBaseTime
      continue
    } else {
      if (dist > maxDistance && maxDistance !== Infinity) continue
      if (!assigned[index]) {
        assigned[index] = true
        targetLine.time.start = bestBaseTime
        continue
      }
      let left = index - 1
      let right = index + 1
      let chosen = -1
      let chosenDist = Infinity
      while (left >= 0 || right < baseTimes.length) {
        if (left >= 0) {
          const d = Math.abs(baseTimes[left] - time.start)
          if (!assigned[left] && d <= maxDistance && d < chosenDist) {
            chosen = left
            chosenDist = d
          }
          left--
        }
        if (right < baseTimes.length) {
          const d = Math.abs(baseTimes[right] - time.start)
          if (!assigned[right] && d <= maxDistance && d < chosenDist) {
            chosen = right
            chosenDist = d
          }
          right++
        }
        if (chosenDist < dist) break
      }
      if (chosen >= 0) {
        assigned[chosen] = true
        targetLine.time.start = baseTimes[chosen]
      } else {
        if (dist <= maxDistance) targetLine.time.start = bestBaseTime
      }
    }
  }

  return result
}
