import type { ValueOf } from '../../types'

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

export const TEXT_SPACER_PROCESS_TYPE = {
  ALL: 'ALL',
  PUNCTUATION: 'PUNCTUATION',
  BRACKET: 'BRACKET',
  QUOTE: 'QUOTE',
  OPERATOR: 'OPERATOR',
  CJK_WITH_ENGLISH_NUMBER: 'CJK_WITH_ENGLISH_NUMBER',
} as const

export type TextSpacerProcessType = ValueOf<typeof TEXT_SPACER_PROCESS_TYPE>

export class TextSpacer {
  private readonly processTypes: Set<TextSpacerProcessType> = new Set()

  private addProcessType(types: TextSpacerProcessType[]) {
    this.processTypes.clear()
    const target = types.includes(TEXT_SPACER_PROCESS_TYPE.ALL) ? Object.values(TEXT_SPACER_PROCESS_TYPE) : types
    for (const item of target) {
      this.processTypes.add(item)
    }
  }

  constructor(types?: TextSpacerProcessType | TextSpacerProcessType[]) {
    if (types) this.addProcessType(Array.isArray(types) ? types : [types])
    else this.addProcessType([TEXT_SPACER_PROCESS_TYPE.ALL])
  }

  private applyPunctuationRules(text: string): string {
    return text.replace(RULES.PUNCTUATION.CJK_WITH_ENGLISH_NUMBER, '$1$2 ').replace(RULES.PUNCTUATION.ENGLISH_NUMBER_WITH_CJK, '$1$2 $3')
  }
  private applyQuoteRules(text: string) {
    return text.replace(RULES.QUOTE.CJK_WITH, '$1 $2').replace(RULES.QUOTE.WITH_CJK, '$1 $2')
  }
  private applyBracketRules(text: string) {
    return text.replace(RULES.BRACKET.CJK_WITH, '$1 $2').replace(RULES.BRACKET.WITH_CJK, '$1 $2')
  }
  private applyOperatorRules(text: string) {
    return text.replace(RULES.OPERATOR.CJK_WITH_ENGLISH_NUMBER, '$1 $2 $3').replace(RULES.OPERATOR.ENGLISH_NUMBER_WITH_CJK, '$1 $2 $3')
  }
  private applyCjkWithEnglishNumber(text: string) {
    return text.replace(RULES.CJK_ENGLISH_NUMBER.CJK_WITH_ENGLISH_NUMBER, '$1 $2').replace(RULES.CJK_ENGLISH_NUMBER.ENGLISH_NUMBER_WITH_CJK, '$1 $2')
  }
  private applyMultipleSpace(text: string) {
    return text.replace(RULES.MULTIPLE_SPACE, ' ')
  }

  private applyRules(text: string) {
    let result = text

    if (this.processTypes.has(TEXT_SPACER_PROCESS_TYPE.PUNCTUATION)) {
      result = this.applyPunctuationRules(result)
    }
    if (this.processTypes.has(TEXT_SPACER_PROCESS_TYPE.QUOTE)) {
      result = this.applyQuoteRules(result)
    }
    if (this.processTypes.has(TEXT_SPACER_PROCESS_TYPE.BRACKET)) {
      result = this.applyBracketRules(result)
    }
    if (this.processTypes.has(TEXT_SPACER_PROCESS_TYPE.OPERATOR)) {
      result = this.applyOperatorRules(result)
    }
    if (this.processTypes.has(TEXT_SPACER_PROCESS_TYPE.CJK_WITH_ENGLISH_NUMBER)) {
      result = this.applyCjkWithEnglishNumber(result)
    }

    result = this.applyMultipleSpace(result)

    return result
  }

  process(text: string) {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return text
    }

    if (!RULES.HAS_CJK.test(text)) {
      return text
    }

    return this.applyRules(text)
  }

  processBatch(list: string[]) {
    if (!list.length) return list
    return list.map((item) => this.process(item))
  }
}
