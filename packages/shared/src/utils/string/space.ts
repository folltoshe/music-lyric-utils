import type { ValueOf } from '../../types'

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
const CJK_RANGE = '[\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]' as const

const ENGLISH_RANGE = '[A-Za-z]' as const
const NUMBER_RANGE = '[0-9]' as const
const ENGLISH_NUMBER_RANGE = `${ENGLISH_RANGE}|${NUMBER_RANGE}` as const

const RULES = {
  PUNCTUATION: {
    CJK_WITH_ENGLISH_NUMBER: new RegExp(`(${CJK_RANGE})([!;,\\?:]+)(?=${CJK_RANGE}|${ENGLISH_NUMBER_RANGE})`, 'g'),
    ENGLISH_NUMBER_WITH_CJK: new RegExp(`(${ENGLISH_NUMBER_RANGE})([!;,\\?]+)(${CJK_RANGE})`, 'g'),
  },
  QUOTE: {
    CJK_WITH: new RegExp(`(${CJK_RANGE})(["\`'])`, 'g'),
    WITH_CJK: new RegExp(`(["\`'])(${CJK_RANGE})`, 'g'),
  },
  BRACKET: {
    CJK_WITH: new RegExp(`(${CJK_RANGE})([({[<])`, 'g'),
    WITH_CJK: new RegExp(`([)}\]>])(${CJK_RANGE})`, 'g'),
  },
  OPERATOR: {
    CJK_WITH_ENGLISH_NUMBER: new RegExp(`(${CJK_RANGE})([+\\-*/=&])(${ENGLISH_NUMBER_RANGE}})`, 'g'),
    ENGLISH_NUMBER_WITH_CJK: new RegExp(`(${ENGLISH_NUMBER_RANGE})([+\\-*/=&])(${CJK_RANGE})`, 'g'),
  },
  CJK_ENGLISH_NUMBER: {
    CJK_WITH_ENGLISH_NUMBER: new RegExp(`(${CJK_RANGE})(${ENGLISH_NUMBER_RANGE})`, 'g'),
    ENGLISH_NUMBER_WITH_CJK: new RegExp(`(${ENGLISH_NUMBER_RANGE})(${CJK_RANGE})`, 'g'),
  },
  HAS_CJK: new RegExp(CJK_RANGE),
  MULTIPLE_SPACE: /[ ]{2,}/g,
} as const

const applyPunctuationRules = (text: string) => {
  return text.replace(RULES.PUNCTUATION.CJK_WITH_ENGLISH_NUMBER, '$1$2 ').replace(RULES.PUNCTUATION.ENGLISH_NUMBER_WITH_CJK, '$1$2 $3')
}
const applyQuoteRules = (text: string) => {
  return text.replace(RULES.QUOTE.CJK_WITH, '$1 $2').replace(RULES.QUOTE.WITH_CJK, '$1 $2')
}
const applyBracketRules = (text: string) => {
  return text.replace(RULES.BRACKET.CJK_WITH, '$1 $2').replace(RULES.BRACKET.WITH_CJK, '$1 $2')
}
const applyOperatorRules = (text: string) => {
  return text.replace(RULES.OPERATOR.CJK_WITH_ENGLISH_NUMBER, '$1 $2 $3').replace(RULES.OPERATOR.ENGLISH_NUMBER_WITH_CJK, '$1 $2 $3')
}
const applyCjkWithEnglishNumber = (text: string) => {
  return text.replace(RULES.CJK_ENGLISH_NUMBER.CJK_WITH_ENGLISH_NUMBER, '$1 $2').replace(RULES.CJK_ENGLISH_NUMBER.ENGLISH_NUMBER_WITH_CJK, '$1 $2')
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

  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.PUNCTUATION)) {
    result = applyPunctuationRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.QUOTE)) {
    result = applyQuoteRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.BRACKET)) {
    result = applyBracketRules(result)
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
