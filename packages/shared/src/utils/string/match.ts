import { isRegExp } from '../regexp'

/**
 * check if text matches a rule
 *
 * @param text text content
 * @param rules match rules
 * @param quick quick match words
 */
export const matchTextIsValid = (text: string, rules: (string | RegExp)[], quick: string[] = []) => {
  const pre = String(text).trim()
  if (pre.length <= 0) return false

  const normalize = pre
    .replaceAll(/[\u0000-\u001F\u007F]+/g, '')
    .replaceAll(/\s+/g, '')
    .trim()
    .toLowerCase()
  if (!normalize.length) return false

  // check quic key word
  for (let i = 0; i < quick.length; i++) {
    const word = quick[i]
    if (word.length > normalize.length) continue
    if (normalize.indexOf(word) >= 0) return true
  }

  // check regex rule
  for (let i = 0; i < rules.length; i++) {
    try {
      const original = rules[i]
      const regex = isRegExp(original) ? (original.global ? new RegExp(original.source, 'iu') : original) : new RegExp(original, 'iu')
      if (regex.test(normalize)) return true
    } catch {
      continue
    }
  }

  return false
}

/**
 * rule match percentage in text
 *
 * @param text text content
 * @param rules match rules
 */
export const matchTextWithPercentage = (text: string, rules: (string | RegExp)[]) => {
  const pre = String(text).trim()
  if (pre.length <= 0) return 0

  const normalize = pre
    .replaceAll(/[\u0000-\u001F\u007F]+/g, '')
    .replaceAll(/\s+/g, '')
    .trim()
    .toLowerCase()
  if (!normalize.length) return 0

  let percentage = 0
  let process = normalize

  for (let i = 0; i < rules.length; i++) {
    const original = rules[i]
    const regex = isRegExp(original) ? (original.global ? original : new RegExp(original.source, 'giu')) : new RegExp(original, 'giu')
    const matches = process.matchAll(regex)
    for (const match of matches) {
      const matchedStr = match[0]
      const matchPercentage = Math.floor((matchedStr.length / normalize.length) * 100)

      percentage = percentage + matchPercentage
      process = process.replace(matchedStr, '')

      if (percentage >= 100) {
        return 100
      }
    }
  }

  return Math.min(100, Math.floor(percentage))
}
