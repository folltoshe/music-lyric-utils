export const EMPTY_CALLBACK = () => {}

export const handleGetNow =
  typeof globalThis.performance?.now === 'function' ? globalThis.performance.now.bind(globalThis.performance) : globalThis.Date.now.bind(globalThis.Date)

export const handleRequestAnimationFrame =
  typeof globalThis.requestAnimationFrame === 'function' ? globalThis.requestAnimationFrame.bind(globalThis) : globalThis.setTimeout.bind(globalThis)

export const handleCancelAnimationFrame =
  typeof globalThis.cancelAnimationFrame === 'function' ? globalThis.cancelAnimationFrame.bind(globalThis) : globalThis.clearTimeout.bind(globalThis)

export class TimeoutTools {
  private invokeTime: number = 0
  private animationFrameId: number | null = null
  private timeoutId: null | NodeJS.Timeout | number = null
  private callback: ((diff: number) => void) | null = null
  private thresholdTime: number = 200

  private run() {
    this.animationFrameId = handleRequestAnimationFrame(() => {
      this.animationFrameId = null
      const diff = this.invokeTime - handleGetNow()
      if (diff > 0) {
        if (diff < this.thresholdTime) {
          this.run()
          return
        }
        this.timeoutId = setTimeout(() => {
          this.timeoutId = null
          this.run()
        }, diff - this.thresholdTime)
        return
      }
      this.callback && this.callback(diff)
    })
  }

  start(callback = EMPTY_CALLBACK, timeout = 0) {
    this.callback = callback
    this.invokeTime = handleGetNow() + timeout
    this.run()
  }

  clear() {
    if (this.animationFrameId) {
      handleCancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.callback = null
  }
}
