import Example from './example'

import { LyricParser } from '@music-lyric-utils/parser'

const parser = new LyricParser()

document.addEventListener('DOMContentLoaded', () => {
  const parseBtn = document.getElementById('parse-btn')
  const resultContainer = document.getElementById('result-container')
  const resultElement = document.getElementById('result')

  if (!parseBtn || !resultContainer || !resultElement) return

  // 解析按钮点击事件
  parseBtn.addEventListener('click', function () {
    const originalElement = document.getElementById('original') as HTMLTextAreaElement
    const original = originalElement.value.trim() || Example.original

    const dynamicElement = document.getElementById('dynamic') as HTMLTextAreaElement
    const dynamic = dynamicElement.value.trim() || Example.dynamic

    const translateElement = document.getElementById('translate') as HTMLTextAreaElement
    const translate = translateElement.value.trim() || Example.translate

    const romanElement = document.getElementById('roman') as HTMLTextAreaElement
    const roman = romanElement.value.trim() || Example.roman

    const result = parser.parse({
      original,
      dynamic,
      roman,
      translate,
    })

    console.log('Parse Result: ', result)

    resultElement.textContent = JSON.stringify(result, null, 2)
    resultContainer.style.display = 'block'

    resultContainer.scrollIntoView({ behavior: 'smooth' })
  })
})
