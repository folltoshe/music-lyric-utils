type EventMap = Record<string, any>

type EventHandler<T = any> = (data?: T) => void

export class EventListener<TEvents extends EventMap> {
  private events: {
    [K in keyof TEvents]?: EventHandler<TEvents[K]>[]
  } = {}

  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    if (typeof handler !== 'function') return
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event]!.push(handler)
  }

  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    const onceHandler: EventHandler<TEvents[K]> = (data) => {
      try {
        handler(data)
      } finally {
        this.off(event, onceHandler)
      }
    }
    this.on(event, onceHandler)
  }

  off<K extends keyof TEvents>(event: K, handler?: EventHandler<TEvents[K]>): void {
    const handlers = this.events[event]
    if (!handlers) return
    if (handler) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      if (handlers.length === 0) {
        delete this.events[event]
      }
    } else {
      delete this.events[event]
    }
  }

  emit<K extends keyof TEvents>(event: K, data?: TEvents[K]): void {
    const handlers = this.events[event]
    if (!handlers) return
    for (const handler of handlers.slice()) {
      try {
        handler(data)
      } catch {
        continue
      }
    }
  }
}
