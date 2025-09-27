const CHINESE_SYMBOLS_MAP: [RegExp, string][] = [
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

  [/（?《/g, '<'],
  [/（?〈/g, '<'],
  [/》/g, '>'],
  [/〉/g, '>'],

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
  for (const [regexp, target] of CHINESE_SYMBOLS_MAP) {
    output = output.replaceAll(regexp, target)
  }
  return output
}
