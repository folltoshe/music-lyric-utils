export const PURIFICATION_MATCH_MODE = {
  EXACT: 'EXACT',
  FUZZY: 'FUZZY',
} as const

export const DEFAULT_PURIFICATION_RULES: RegExp[] = [/(?:版权所有|License)/, /(?:翻唱|Cover)/, /(?:纯音乐)/]

export const DEFAULT_PURIFICATION_RULES_QUICK_KEYWORDS: string[] = (() => {
  const src = DEFAULT_PURIFICATION_RULES.map((r) => r.source).join(' ')
  const raw = src.match(/[A-Za-z\u4e00-\u9fff]{2,}/g) || []

  const uniq = Array.from(new Set(raw.map((s) => s.toLowerCase())))
  uniq.sort((a, b) => b.length - a.length)

  return uniq
})()
