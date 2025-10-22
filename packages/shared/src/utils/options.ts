import type { DeepPartial, PathValue, NestedKeys } from '@root/types'

import { get, set, merge, cloneDeep } from './object'

import { EventListener } from './event'

interface Events {
  'config-update': () => void
}

export class OptionsManager<T extends Record<string, any>> extends EventListener<Events> {
  private current: T

  constructor(def: T) {
    super()
    this.current = cloneDeep(def)
  }

  getAll() {
    return this.current
  }

  getByKey<K extends NestedKeys<T>>(key: K): PathValue<T, K> {
    return get(this.current, key)
  }

  updateAll(opt: DeepPartial<T>) {
    if (!opt) return
    this.current = merge(this.current, opt)
    this.emit('config-update')
  }

  updateByKey<K extends NestedKeys<T>>(key: K, value: PathValue<T, K>) {
    if (!key || !value) return
    this.current = set(this.current, key, value)
    this.emit('config-update')
  }
}
