## Install

```shell
npm install @music-lyric-utils/parser
```

## Usage

```js
import { LyricParser } from '@music-lyric-utils/parser'

const parser = new LyricParser()

const origin = ''
const dynamic = ''
const translate = ''
const roman = ''

console.log(parser.parse({ original, dynamic, translate, roman }))
```
