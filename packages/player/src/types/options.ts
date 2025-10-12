import type { DeepRequired, Lyric } from '@music-lyric-utils/shared'

export interface PlayerOptions {
  /**
   * Listening lyric line play event
   * @param line line number of current play
   * @param info line info
   */
  onLinePlay?: (lineNum: number, info: Lyric.Line.Info) => void

  /**
   * listening lyrics seting event
   * @param lines array of all lyric text
   */
  onSetLyric?: (info: Lyric.Info) => void

  /**
   * offset time(ms), default is 150 ms
   */
  offset?: number

  /**
   * play speed, default is 1
   */
  speed?: number
}

export type RequiredPlayerOptions = DeepRequired<PlayerOptions>
