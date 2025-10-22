import type { ValueOf } from '@root/types'

export const INSERT_TEXT_SPACE_TYPES = {
  ALL: 'ALL',
  PUNCTUATION: 'PUNCTUATION',
  BRACKET: 'BRACKET',
  QUOTE: 'QUOTE',
  OPERATOR: 'OPERATOR',
  CJK_WITH_ENGLISH_NUMBER: 'CJK_WITH_ENGLISH_NUMBER',
  HYPHEN_SLASH: 'HYPHEN_SLASH',
} as const

export type InsertTextSpaceTypes = ValueOf<typeof INSERT_TEXT_SPACE_TYPES>

const INSERT_TEXT_SPACE_TYPES_VALUE = Object.values(INSERT_TEXT_SPACE_TYPES) as InsertTextSpaceTypes[]

// prettier-ignore
const CJK_RANGE = '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff' as const

const ENGLISH_RANGE = 'A-Za-z' as const
const NUMBER_RANGE = '0-9' as const
const ENGLISH_NUMBER_RANGE = `${ENGLISH_RANGE}${NUMBER_RANGE}` as const

const SYMBOL_RANGE = '!@#$%^&*+\\-=/|<>' as const
const ALL_RANGE = `${ENGLISH_RANGE}${NUMBER_RANGE}${CJK_RANGE}${SYMBOL_RANGE}` as const

const ABBREVIATIONS = [
  /I'[dmsv]/gi, // I'd, I'm, I's, I've
  /(?:[A-Za-z]')['a-z]*/g, // don't, can't, we'll
] as const

const RULES = {
  PUNCTUATION: new RegExp(`([${ALL_RANGE}])([!;,\\?:])(?=[${ALL_RANGE}])`, 'g'),
  QUOTE: {
    BEFORE: new RegExp(`([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])(["\`'])`, 'g'),
    AFTER: new RegExp(`(["\`'])([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])`, 'g'),
  },
  BRACKET: {
    // ABC(ABC) -> ABC (ABC)
    OUTSIDE_BEFORE: new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])([\\[({<])`, 'g'),
    OUTSIDE_AFTER: new RegExp(`([\\])}>])([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'g'),
    INSIDE_OPERATOR: new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])([+\\-*/=&])([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'g'),
  },
  OPERATOR: new RegExp(`([${ALL_RANGE}])([+\\-*/=&])([${ALL_RANGE}])`, 'g'),
  HYPHEN_SLASH: {
    HYPHEN: new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(-)([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'g'),
    SLASH: new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(/)([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'g'),
    HYPHEN_EDGE: new RegExp(`(\\s|^)(-)([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])|([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(-)(\\s|$)`, 'g'),
  },
  CJK_ENGLISH: {
    CJK_WITH_EN: new RegExp(`([${CJK_RANGE}])([${ENGLISH_NUMBER_RANGE}])`, 'g'),
    EN_WITH_CJK: new RegExp(`([${ENGLISH_NUMBER_RANGE}])([${CJK_RANGE}])`, 'g'),
  },
  HAS_CJK: new RegExp(`[${CJK_RANGE}]`),
  MULTIPLE_SPACE: /[ ]{2,}/g,
} as const

const protectAbbreviations = (text: string): [string, Map<string, string>] => {
  const protectedMap = new Map<string, string>()
  let protectedText = text
  let counter = 0

  ABBREVIATIONS.forEach((pattern) => {
    protectedText = protectedText.replace(pattern, (match) => {
      const placeholder = `__ABBR_${counter++}__`
      protectedMap.set(placeholder, match)
      return placeholder
    })
  })

  return [protectedText, protectedMap]
}

// 恢复保护的缩写
const restoreAbbreviations = (text: string, protectedMap: Map<string, string>): string => {
  let result = text
  protectedMap.forEach((value, key) => {
    result = result.replace(new RegExp(key, 'g'), value)
  })
  return result
}

// 处理括号内容的特殊函数 - 确保不在括号开头和结尾添加空格
const processBracketContent = (content: string): string => {
  if (!content) return content

  let processed = content

  // 在括号内部应用操作符规则（但不影响开头和结尾）
  processed = processed.replace(RULES.BRACKET.INSIDE_OPERATOR, '$1 $2 $3')

  // 在括号内部应用连字符和斜杠规则
  processed = processed.replace(RULES.HYPHEN_SLASH.HYPHEN, '$1 $2 $3')
  processed = processed.replace(RULES.HYPHEN_SLASH.SLASH, '$1 $2 $3')

  return processed
}

const applyPunctuationRules = (text: string) => {
  return text.replace(RULES.PUNCTUATION, '$1$2 ')
}

const applyQuoteRules = (text: string) => {
  return text.replace(RULES.QUOTE.BEFORE, '$1 $2').replace(RULES.QUOTE.AFTER, '$1 $2')
}

const applyBracketRules = (text: string) => {
  // 先处理括号外部
  let result = text.replace(RULES.BRACKET.OUTSIDE_BEFORE, '$1 $2')
  result = result.replace(RULES.BRACKET.OUTSIDE_AFTER, '$1 $2')

  // 处理括号内部内容，但不修改括号本身
  result = result.replace(/([\[({<])([^\]})>]+)([\])}>])/g, (match, openBracket, content, closeBracket) => {
    return openBracket + processBracketContent(content) + closeBracket
  })

  return result
}

const applyOperatorRules = (text: string) => {
  return text.replace(RULES.OPERATOR, '$1 $2 $3')
}

const applyHyphenSlashRules = (text: string) => {
  let result = text
  // 处理连字符
  result = result.replace(RULES.HYPHEN_SLASH.HYPHEN, '$1 $2 $3')
  // 处理斜杠
  result = result.replace(RULES.HYPHEN_SLASH.SLASH, '$1 $2 $3')
  // 处理边缘连字符
  result = result.replace(RULES.HYPHEN_SLASH.HYPHEN_EDGE, (match, space1, hyphen1, char1, char2, hyphen2, space2) => {
    if (space1 !== undefined) return `${space1}${hyphen1} ${char1}`
    if (space2 !== undefined) return `${char2} ${hyphen2}${space2}`
    return match
  })
  return result
}

const applyCjkWithEnglishNumber = (text: string) => {
  return text.replace(RULES.CJK_ENGLISH.CJK_WITH_EN, '$1 $2').replace(RULES.CJK_ENGLISH.EN_WITH_CJK, '$1 $2')
}

const applyMultipleSpace = (text: string) => {
  return text.replace(RULES.MULTIPLE_SPACE, ' ')
}

const handleProcessTypes = (types?: InsertTextSpaceTypes[]) => {
  const target = types || [INSERT_TEXT_SPACE_TYPES.ALL]
  return new Set<InsertTextSpaceTypes>(target.includes(INSERT_TEXT_SPACE_TYPES.ALL) ? INSERT_TEXT_SPACE_TYPES_VALUE : target)
}

export const insertSpace = (text: string, types?: InsertTextSpaceTypes[]) => {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return text
  }

  const processTypes = handleProcessTypes(types)

  const [protectedText, abbreviationMap] = protectAbbreviations(text)

  let result = protectedText

  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.BRACKET)) {
    result = applyBracketRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.QUOTE)) {
    result = applyQuoteRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.PUNCTUATION)) {
    result = applyPunctuationRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.OPERATOR)) {
    result = applyOperatorRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.HYPHEN_SLASH)) {
    result = applyHyphenSlashRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.CJK_WITH_ENGLISH_NUMBER)) {
    result = applyCjkWithEnglishNumber(result)
  }

  result = applyMultipleSpace(result)

  result = restoreAbbreviations(result, abbreviationMap)

  result = result.trim()

  return result
}

export const insertSpaceBatch = (list: string[], types?: InsertTextSpaceTypes[]) => {
  if (!list.length) {
    return list
  }

  return list.map((item) => insertSpace(item, types))
}
