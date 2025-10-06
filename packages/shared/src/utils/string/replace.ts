import { isRegExp } from 'lodash'

/**
 * replace matched text to target
 *
 * @param text original text
 * @param target target text
 * @param rules replace rule
 * @param flag regexp flag
 */
export const replaceFromText = (text: string, target: string, rules: (string | RegExp)[], flag: string = 'giu') => {
  let result = text
  for (const rule of rules) {
    try {
      const regex = isRegExp(rule) ? rule : new RegExp(rule, flag)
      result = regex.global ? result.replaceAll(regex, target) : result.replace(regex, target)
    } catch {
      continue
    }
  }
  return result
}
