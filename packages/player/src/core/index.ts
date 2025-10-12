import type { Lyric } from '@music-lyric-utils/shared'
import type { PlayerOptions, RequiredPlayerOptions } from '@root/interface'

import { EMPTY_LYRIC_INFO } from '@music-lyric-utils/shared'
import { DEFAULT_PLAYER_OPTIONS } from '@root/constant/options'

import { cloneDeep, OptionsManager } from '@music-lyric-utils/shared'
import { handleGetNow, TimeoutTools } from '@root/utils'

abstract class LyricPlayerOptions {
  protected options = new OptionsManager<RequiredPlayerOptions>(DEFAULT_PLAYER_OPTIONS)

  constructor(opt?: PlayerOptions) {
    if (opt) this.options.setAll(opt)
  }

  protected abstract onUpdateOptions(): void

  updateOptionsWithKey(...args: Parameters<typeof this.options.setByKey>) {
    this.options.setByKey(...args)
    this.onUpdateOptions()
  }

  updateOptions(...args: Parameters<typeof this.options.setAll>) {
    this.options.setAll(...args)
    this.onUpdateOptions()
  }
}

export class LyricPlayer extends LyricPlayerOptions {
  private timeout: {
    line: TimeoutTools
  }

  private current: {
    status: {
      playing: boolean
      startTime: number
      performanceTime: number
    }
    lyricInfo: Lyric.Info
    lineInfo: {
      now: number
      max: number
    }
  }

  constructor(opt?: PlayerOptions) {
    super(opt)

    this.timeout = {
      line: new TimeoutTools(),
    }

    this.current = {
      status: {
        playing: false,
        performanceTime: 0,
        startTime: 0,
      },
      lyricInfo: cloneDeep(EMPTY_LYRIC_INFO),
      lineInfo: {
        now: 0,
        max: 0,
      },
    }

    this.handleUpdateLyric()
  }

  protected override onUpdateOptions() {
    if (!this.current.status.playing) return
    this.play(this.handleGetCurrentTime())
  }

  handleGetCurrentTime() {
    const now = handleGetNow()
    return (now - this.current.status.performanceTime) * this.currentSpeed + this.current.status.startTime
  }

  private handleUpdateLyric() {
    this.options.getByKey('onSetLyric')(this.current.lyricInfo)
    this.current.lineInfo.max = this.current.lyricInfo.lines.length - 1
  }

  private handleFindCurrentLine(time: number, start = 0) {
    if (time <= 0) return 0
    const length = this.current.lyricInfo.lines.length
    for (let index = start; index < length; index++) {
      if (time <= this.current.lyricInfo.lines[index].time.start) return index === 0 ? 0 : index - 1
    }
    return length - 1
  }

  private handlePlayMaxLine() {
    const currentLine = this.current.lyricInfo.lines[this.current.lineInfo.now]
    this.options.getByKey('onLinePlay')(this.current.lineInfo.now, currentLine)

    if (currentLine.time.duration > 0) {
      this.timeout.line.start(() => this.pause(), currentLine.time.duration)
    } else {
      this.pause()
    }
  }

  private handleLineRefresh() {
    if (!this.current.lyricInfo.config.isSupportAutoScroll) return

    this.current.lineInfo.now++
    if (this.current.lineInfo.now >= this.current.lineInfo.max) {
      this.handlePlayMaxLine()
      return
    }

    const currentLine = this.current.lyricInfo.lines[this.current.lineInfo.now]
    const currentTime = this.handleGetCurrentTime()

    const driftTime = currentTime - currentLine.time.start
    if (driftTime >= 0 || this.current.lineInfo.now === 0) {
      const nextLine = this.current.lyricInfo.lines[this.current.lineInfo.now + 1]
      const delay = (nextLine.time.start - currentLine.time.start - driftTime) / this.currentSpeed
      if (delay > 0) {
        if (this.current.status.playing) {
          this.timeout.line.start(() => {
            if (!this.current.status.playing) return
            this.handleLineRefresh()
          }, delay)
        }
        this.options.getByKey('onLinePlay')(this.current.lineInfo.now, currentLine)
      } else {
        const newCurLineNum = this.handleFindCurrentLine(currentTime, this.current.lineInfo.now + 1)
        if (newCurLineNum > this.current.lineInfo.now) this.current.lineInfo.now = newCurLineNum - 1
        this.handleLineRefresh()
      }
      return
    }

    this.current.lineInfo.now = this.handleFindCurrentLine(currentTime, this.current.lineInfo.now) - 1
    this.handleLineRefresh()
  }

  private handleLinePause() {
    if (!this.current.status.playing) return

    this.current.status.playing = false
    this.timeout.line.clear()

    if (this.current.lineInfo.now === this.current.lineInfo.max || !this.current.lyricInfo.config.isSupportAutoScroll) {
      return
    }

    const currentLineNum = this.handleFindCurrentLine(this.handleGetCurrentTime())
    if (this.current.lineInfo.now !== currentLineNum) {
      this.current.lineInfo.now = currentLineNum
      this.options.getByKey('onLinePlay')(currentLineNum, this.current.lyricInfo.lines[currentLineNum])
    }
  }

  play(currentTime: number = 0) {
    if (!this.current.lyricInfo.lines.length) return

    this.pause()

    this.current.status.playing = true
    this.current.status.startTime = currentTime

    const offset = Math.trunc(this.options.getByKey('offset') + this.current.lyricInfo.meta.offset)
    this.current.status.performanceTime = handleGetNow() - offset

    this.current.lineInfo.now = this.handleFindCurrentLine(this.handleGetCurrentTime()) - 1
    this.handleLineRefresh()
  }

  pause() {
    this.handleLinePause()
  }

  updateLyric(lyricInfo: Lyric.Info) {
    if (this.current.status.playing) this.pause()
    this.current.lyricInfo = lyricInfo
    this.handleUpdateLyric()
  }

  get isPlaying() {
    return this.current.status.playing
  }

  get currentSpeed() {
    return Number(this.options.getByKey('speed')) || 1
  }

  get currentLyricInfo() {
    return this.current.lyricInfo
  }

  get currentLineInfo() {
    return this.current.lineInfo
  }
}
