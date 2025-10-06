import { isRegExp } from 'lodash'

/**
 * check if text matches a rule
 *
 * @param text text content
 * @param rules match rules
 * @param quick quick match words
 */
export const matchTextIsValid = (text: string, rules: string | RegExp[], quick: string[] = []) => {
  const pre = String(text).trim()
  if (!pre) return false

  const normalize = pre
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const lower = normalize.toLowerCase()

  // check quic key word
  for (let i = 0; i < quick.length; i++) {
    const word = quick[i]
    if (word.length > lower.length) continue
    if (lower.indexOf(word) >= 0) return true
  }

  // check regex rule
  for (let i = 0; i < rules.length; i++) {
    try {
      const original = rules[i]
      const regex = isRegExp(original) ? original : new RegExp(original, 'iu')
      if (regex.test(lower)) return true
    } catch {
      continue
    }
  }

  return false
}
