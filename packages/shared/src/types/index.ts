type IsPlainObject<T> = T extends object ? (T extends Function ? false : T extends readonly any[] ? false : true) : false

type JoinKey<K extends string, P extends string> = P extends '' ? K : `${K}.${P}`

type SplitKey<S extends string, D extends string = '.'> = S extends '' ? [] : S extends `${infer Head}${D}${infer Rest}` ? [Head, ...SplitKey<Rest, D>] : [S]

export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: IsPlainObject<T[K]> extends true ? K | JoinKey<K, Extract<NestedKeys<T[K]>, string>> : K
    }[keyof T & string]
  : never

type PathValueByKeys<T, Keys extends readonly string[]> = Keys extends [infer Head, ...infer Tail]
  ? Head extends keyof T
    ? Tail extends []
      ? T[Head]
      : PathValueByKeys<NonNullable<T[Head]>, Extract<Tail, string[]>>
    : undefined
  : T

export type PathValue<T, K extends string> = PathValueByKeys<T, SplitKey<K>>

export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Map<infer K, infer V>
  ? Map<DeepPartial<K>, DeepPartial<V>>
  : T extends Set<infer U>
  ? Set<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly any[]
  ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
  : T extends Array<infer U>
  ? Array<DeepRequired<NonNullable<U>>>
  : T extends Map<infer K, infer V>
  ? Map<DeepRequired<K>, DeepRequired<V>>
  : T extends Set<infer U>
  ? Set<DeepRequired<U>>
  : T extends object
  ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
  : NonNullable<T>
