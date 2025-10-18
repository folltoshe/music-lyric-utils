const CRC32_POLY = 0xedb88320 >>> 0

const CRC32_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i >>> 0
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? CRC32_POLY ^ (c >>> 1) : c >>> 1
    }
    t[i] = c >>> 0
  }
  return t
})()

const textEncoder = typeof globalThis.TextEncoder !== 'undefined' ? new TextEncoder() : null

const toBytes = (input: string): Uint8Array => {
  if (textEncoder) return textEncoder.encode(input)

  const out: number[] = []
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i)
    if (code < 0x80) out.push(code)
    else if (code < 0x800) {
      out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code >= 0xd800 && code <= 0xdfff) {
      i++
      const code2 = input.charCodeAt(i)
      const combined = 0x10000 + (((code & 0x3ff) << 10) | (code2 & 0x3ff))
      out.push(0xf0 | (combined >>> 18), 0x80 | ((combined >>> 12) & 0x3f), 0x80 | ((combined >>> 6) & 0x3f), 0x80 | (combined & 0x3f))
    } else {
      out.push(0xe0 | (code >>> 12), 0x80 | ((code >>> 6) & 0x3f), 0x80 | (code & 0x3f))
    }
  }

  return new Uint8Array(out)
}

export const crc32 = (input: string | Uint8Array) => {
  const bytes = typeof input === 'string' ? toBytes(input) : input
  let crc = 0xffffffff >>> 0
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ b) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

export const crc32WithHex = (input: string | Uint8Array) => {
  const n = crc32(input) >>> 0
  return n.toString(16).padStart(8, '0')
}
