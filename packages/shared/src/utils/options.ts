import { get, set, merge } from './object'

import { type DeepPartial, type PathValue, type NestedKeys } from '../types'

export class OptionsManager<T extends Record<string, any>> {
  private current: T

  constructor(def: T) {
    this.current = def
  }

  getAll() {
    return this.current
  }

  getByKey<K extends NestedKeys<T>>(key: K): PathValue<T, K> {
    return get(this.current, key)
  }

  setAll(opt: DeepPartial<T>) {
    if (!opt) return
    this.current = merge(this.current, opt)
  }

  setByKey<K extends NestedKeys<T>>(key: K, value: PathValue<T, K>) {
    if (!key || !value) return
    this.current = set(this.current, key, value)
  }
}
