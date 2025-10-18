import Example from './example'

import { LyricParser, type ParserProps } from '@music-lyric-utils/parser'

const LOCAL_HISTORY_KEY = 'last-parse'

const parser = new LyricParser()

document.addEventListener('DOMContentLoaded', () => {
  const parseBtn = document.getElementById('parse-btn')
  const loadBtn = document.getElementById('load-btn')

  const resultContainer = document.getElementById('result-container')
  const resultElement = document.getElementById('result')

  const originalElement = document.getElementById('original') as HTMLTextAreaElement
  const dynamicElement = document.getElementById('dynamic') as HTMLTextAreaElement
  const translateElement = document.getElementById('translate') as HTMLTextAreaElement
  const romanElement = document.getElementById('roman') as HTMLTextAreaElement

  if (!resultContainer || !resultElement) return

  const handleParse = (content: ParserProps) => {
    const result = parser.parse(content)

    console.log('Parse Result: ', result)

    resultElement.textContent = JSON.stringify(result, null, 2)
    resultContainer.style.display = 'block'

    resultContainer.scrollIntoView({ behavior: 'smooth' })
  }

  // 解析按钮点击事件
  parseBtn?.addEventListener('click', () => {
    const original = originalElement.value.trim() || Example.original
    const dynamic = dynamicElement.value.trim() || ''
    const translate = translateElement.value.trim() || ''
    const roman = romanElement.value.trim() || ''

    const history = JSON.stringify({ original, dynamic, translate, roman })
    localStorage.setItem(LOCAL_HISTORY_KEY, history)

    handleParse({
      original,
      dynamic,
      translate,
      roman,
    })
  })

  loadBtn?.addEventListener('click', () => {
    const history = localStorage.getItem(LOCAL_HISTORY_KEY)
    if (!history) return
    try {
      const parsed = JSON.parse(history)

      originalElement.textContent = String(parsed.original).trim() || ''
      dynamicElement.textContent = String(parsed.dynamic).trim() || ''
      translateElement.textContent = String(parsed.translate).trim() || ''
      romanElement.textContent = String(parsed.roman).trim() || ''

      handleParse(parsed)
    } catch {}
  })
})
