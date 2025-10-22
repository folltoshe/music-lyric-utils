import type { Lyric } from '@music-lyric-utils/shared'

import { cloneDeep } from '@music-lyric-utils/shared'

export interface AlignLyricLine {
  time: Lyric.Time
  [k: string]: any
}

const findNearestIndex = (baseTimes: number[], targetTime: number, baseAssigned: boolean[], unique: boolean): number => {
  let nearestIndex = -1
  let minDistance = Infinity

  for (let i = 0; i < baseTimes.length; i++) {
    if (unique && baseAssigned[i]) continue

    const distance = Math.abs(baseTimes[i] - targetTime)
    if (distance < minDistance) {
      minDistance = distance
      nearestIndex = i
    }
  }

  return nearestIndex
}

const isMatchOrderValid = (index: number, matchs: number[], baseIndex: number, sortedTarget: Array<{ time: Lyric.Time; originalIndex: number }>): boolean => {
  if (index === 0) return true

  const prevIndex = index - 1
  if (matchs[index] === -1) return true

  const prevBaseIndex = matchs[prevIndex]

  const currentTime = sortedTarget[index].time.start
  const prevTime = sortedTarget[prevIndex].time.start

  if (currentTime <= prevTime) {
    return true
  }

  return baseIndex >= prevBaseIndex
}

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
    return target
  }

  const result = target.map((t) => cloneDeep(t))

  const baseTimes = base.map((item) => item.time.start).sort((a, b) => a - b)
  const sortedTarget = result.map((item, index) => ({ time: item.time, originalIndex: index })).sort((a, b) => a.time.start - b.time.start)

  const baseAssigned = new Array(baseTimes.length).fill(false)
  const targetMatches = new Array(sortedTarget.length).fill(-1)

  for (let i = 0; i < sortedTarget.length; i++) {
    const { time } = sortedTarget[i]
    const targetTime = time.start

    for (let j = 0; j < baseTimes.length; j++) {
      if (baseAssigned[j] && unique) continue

      const distance = Math.abs(baseTimes[j] - targetTime)
      if (distance === 0 && distance <= maxDistance) {
        targetMatches[i] = j
        if (unique) baseAssigned[j] = true
        break
      }
    }
  }

  for (let i = 0; i < sortedTarget.length; i++) {
    if (targetMatches[i] !== -1) continue

    const { time } = sortedTarget[i]
    const targetTime = time.start

    const nearestIdx = findNearestIndex(baseTimes, targetTime, baseAssigned, unique)

    if (nearestIdx === -1) continue

    const distance = Math.abs(baseTimes[nearestIdx] - targetTime)

    if (distance > threshold || distance > maxDistance) continue

    if (!isMatchOrderValid(i, targetMatches, nearestIdx, sortedTarget)) {
      continue
    }

    targetMatches[i] = nearestIdx
    if (unique) baseAssigned[nearestIdx] = true
  }

  for (let i = 0; i < sortedTarget.length; i++) {
    if (targetMatches[i] !== -1) {
      const { originalIndex } = sortedTarget[i]
      result[originalIndex].time.start = baseTimes[targetMatches[i]]
    }
  }

  return result
}
