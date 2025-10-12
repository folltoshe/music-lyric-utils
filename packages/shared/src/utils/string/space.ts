import type { ValueOf } from '../../types/utils'

export const INSERT_TEXT_SPACE_TYPES = {
  ALL: 'ALL',
  PUNCTUATION: 'PUNCTUATION',
  BRACKET: 'BRACKET',
  QUOTE: 'QUOTE',
  OPERATOR: 'OPERATOR',
  CJK_WITH_ENGLISH_NUMBER: 'CJK_WITH_ENGLISH_NUMBER',
} as const

export type InsertTextSpaceTypes = ValueOf<typeof INSERT_TEXT_SPACE_TYPES>

const INSERT_TEXT_SPACE_TYPES_VALUE = Object.values(INSERT_TEXT_SPACE_TYPES) as InsertTextSpaceTypes[]

// prettier-ignore
const CJK_RANGE = '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff' as const

const ENGLISH_RANGE = 'A-Za-z' as const
const NUMBER_RANGE = '0-9' as const
const ENGLISH_NUMBER_RANGE = `${ENGLISH_RANGE}${NUMBER_RANGE}` as const

const ALL_RANGE = `${ENGLISH_RANGE}${NUMBER_RANGE}${CJK_RANGE}` as const

const RULES = {
  PUNCTUATION: new RegExp(`([${ALL_RANGE}])([!;,\\?:])(?=[${ALL_RANGE}])`, 'g'),
  QUOTE: {
    BEFORE: new RegExp(`([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])(["\`'])`, 'g'),
    AFTER: new RegExp(`(["\`'])([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])`, 'g'),
  },
  BRACKET: {
    BEFORE_OPEN: new RegExp(`([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])([\\[({<])`, 'g'),
    AFTER_CLOSE: new RegExp(`([\\])}>])([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])`, 'g'),
  },
  OPERATOR: new RegExp(`([${ALL_RANGE}])([+\\-*/=&])([${ALL_RANGE}])`, 'g'),
  CJK_ENGLISH: {
    CJK_WITH_EN: new RegExp(`([${CJK_RANGE}])([${ENGLISH_NUMBER_RANGE}])`, 'g'),
    EN_WITH_CJK: new RegExp(`([${ENGLISH_NUMBER_RANGE}])([${CJK_RANGE}])`, 'g'),
  },
  HAS_CJK: new RegExp(`[${CJK_RANGE}]`),
  MULTIPLE_SPACE: /[ ]{2,}/g,
} as const

const applyPunctuationRules = (text: string) => {
  return text.replace(RULES.PUNCTUATION, '$1$2 ')
}
const applyQuoteRules = (text: string) => {
  return text.replace(RULES.QUOTE.BEFORE, '$1 $2').replace(RULES.QUOTE.AFTER, '$1 $2')
}
const applyBracketRules = (text: string) => {
  return text.replace(RULES.BRACKET.BEFORE_OPEN, '$1 $2').replace(RULES.BRACKET.AFTER_CLOSE, '$1 $2')
}
const applyOperatorRules = (text: string) => {
  return text.replace(RULES.OPERATOR, '$1 $2 $3')
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

  if (!RULES.HAS_CJK.test(text)) {
    return text
  }

  const processTypes = handleProcessTypes(types)

  let result = text

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
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.CJK_WITH_ENGLISH_NUMBER)) {
    result = applyCjkWithEnglishNumber(result)
  }

  result = applyMultipleSpace(result)

  return result
}

export const insertSpaceBatch = (list: string[], types?: InsertTextSpaceTypes[]) => {
  if (!list.length) {
    return list
  }

  return list.map((item) => insertSpace(item, types))
}
