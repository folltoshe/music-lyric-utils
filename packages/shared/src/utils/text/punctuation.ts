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

const SAME_QUOTE_CHARS = [`"`]
const PAIRED_QUOTES = [
  ['“', '”'],
  ['‘', '’'], // unicode
  ['「', '」'],
  ['『', '』'],
  ['«', '»'],
]
const LEFT_CHARS = ['(', '[', '{', '（', '【', '「', '『', '〈', '《', '“', '"', '‘']
const RIGHT_CHARS = [')', ']', '}', '）', '】', '」', '』', '〉', '》', '”', '"', '’']
const BOTH_SIDES_CHARS = ['-', '/', '—', '–']

const findSameQuoteRanges = (text: string, char: string) => {
  const result: [number, number][] = []

  let i = 0
  while (i < text.length) {
    const idx = text.indexOf(char, i)
    if (idx === -1) break
    let backslashes = 0
    let k = idx - 1
    while (k >= 0 && text[k] === '\\') {
      backslashes++
      k--
    }
    if (backslashes % 2 === 1) {
      i = idx + 1
      continue
    }

    let j = idx + 1
    while (j < text.length) {
      const idx2 = text.indexOf(char, j)
      if (idx2 === -1) {
        j = -1
        break
      }
      backslashes = 0
      k = idx2 - 1
      while (k >= 0 && text[k] === '\\') {
        backslashes++
        k--
      }
      if (backslashes % 2 === 1) {
        j = idx2 + 1
        continue
      }
      if (idx2 > idx + 1) result.push([idx + 1, idx2 - 1])
      i = idx2 + 1
      break
    }
    if (j === -1) break
  }

  return result
}

const findPairedQuoteRanges = (text: string, left: string, right: string) => {
  const result: [number, number][] = []

  let i = 0
  while (i < text.length) {
    const li = text.indexOf(left, i)
    if (li === -1) break
    const ri = text.indexOf(right, li + 1)
    if (ri === -1) break
    if (ri > li + 1) result.push([li + 1, ri - 1])
    i = ri + 1
  }

  return result
}

export const insertPunctuationSpace = (text: string) => {
  if (!text.trim()) return text

  const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  const protectedRanges: [number, number][] = []

  for (const char of SAME_QUOTE_CHARS) {
    protectedRanges.push(...findSameQuoteRanges(text, char))
  }
  for (const [left, right] of PAIRED_QUOTES) {
    protectedRanges.push(...findPairedQuoteRanges(text, left, right))
  }

  protectedRanges.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const r of protectedRanges) {
    if (!merged.length) merged.push(r)
    else {
      const last = merged[merged.length - 1]
      if (r[0] <= last[1] + 1) last[1] = Math.max(last[1], r[1])
      else merged.push(r)
    }
  }

  const segments = []
  let pos = 0
  for (const [a, b] of merged) {
    if (pos < a) segments.push({ text: text.slice(pos, a), protected: false })
    segments.push({ text: text.slice(a, b + 1), protected: true })
    pos = b + 1
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), protected: false })

  const leftChars = LEFT_CHARS.map(esc).join('')
  const rightChars = RIGHT_CHARS.map(esc).join('')
  const bothChars = BOTH_SIDES_CHARS.map(esc).join('')

  const processOutside = (text: string) => {
    if (!text) return text

    text = text.replace(new RegExp(`([^\\s])([${bothChars}])`, 'gu'), '$1 $2').replace(new RegExp(`([${bothChars}])([^\\s])`, 'gu'), '$1 $2')
    text = text.replace(new RegExp(`([${bothChars}])([^\\s])`, 'gu'), '$1 $2')

    text = text.replace(new RegExp(`([^\\s\\r\\n])([${leftChars}])`, 'gu'), '$1 $2')

    text = text.replace(new RegExp(`([${rightChars}])(?=[^\\s\\r\\n])`, 'gu'), '$1 ')

    text = text.replace(/\p{P}/gu, (m, offset, whole) => {
      if (new RegExp(`^[${leftChars}${rightChars}${bothChars}]$`).test(m)) return m

      const prev = whole[offset - 1]
      const next = whole[offset + 1]

      if (m === "'") {
        // like it's / don't
        if (prev && next && /[\p{L}\p{N}]/u.test(prev) && /[\p{L}\p{N}]/u.test(next)) {
          return m
        }
      }

      // check "." in number
      if (m === '.' && prev && next && /\d/.test(prev) && /\d/.test(next)) return m

      if (!next || /\s/.test(next)) return m

      return m + ' '
    })

    // merge space
    text = text.replace(/([^\S\r\n]){2,}/g, ' ')

    return text
  }

  const out = segments.map((seg) => (seg.protected ? seg.text : processOutside(seg.text))).join('')

  return out.replace(/([^\S\r\n]){2,}/g, ' ')
}

const FIRST_PUBCTUATION_CHAR = /^[\p{P}]/u

export const checkFirstCharIsPunctuation = (text: string) => {
  return FIRST_PUBCTUATION_CHAR.test(text)
}

const END_PUBCTUATION_CHAR = /[\p{P}]$/u

export const checkEndCharIsPunctuation = (text: string) => {
  return END_PUBCTUATION_CHAR.test(text)
}
