const CHINESE_PUBCTUATIONS_MAP: [RegExp, string][] = [
  [/([。．｡])/g, '.'],

  [/([，､、﹐])/g, ','],

  [/；/g, ';'],

  [/([：︰])/g, ':'],

  [/([？﹖])/g, '?'],

  [/([！﹗])/g, '!'],

  [/([…⋯])/g, '...'],

  [/([·・•])/g, '.'],

  [/（/g, '('],
  [/）/g, ')'],

  [/【/g, '['],
  [/】/g, ']'],

  [/([“”〝〞「」『』“”﹁﹂﹃﹄])/g, '"'],

  [/([‘’‚‛ʼ′])/g, "'"],

  [/([—–―-])/g, '-'],

  [/([~〜～])/g, '~'],

  [/···/g, '...'],

  [/％/g, '%'],
  [/＃/g, '#'],
  [/＆/g, '&'],
  [/＊/g, '*'],
  [/＠/g, '@'],
  [/＋/g, '+'],
  [/＝/g, '='],
  [/／/g, '/'],
  [/＼/g, '\\'],

  [/￥/g, '¥'],

  [/．/g, '.'],

  [/　/g, ' '],

  [/•/g, '.'],
  [/◆/g, '-'],
  [/·/g, '.'],
] as const

export const replaceChinesePunctuationToEnglish = (content: string) => {
  let output = content
  for (const [regexp, target] of CHINESE_PUBCTUATIONS_MAP) {
    output = output.replaceAll(regexp, target)
  }
  return output
}

const FIRST_PUBCTUATION_CHAR = /^[\p{P}]/u

export const checkFirstCharIsPunctuation = (text: string) => {
  return FIRST_PUBCTUATION_CHAR.test(text)
}

const END_PUBCTUATION_CHAR = /[\p{P}]$/u

export const checkEndCharIsPunctuation = (text: string) => {
  return END_PUBCTUATION_CHAR.test(text)
}
