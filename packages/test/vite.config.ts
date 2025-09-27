import Path from 'node:path'

import { defineConfig } from 'vite'

const RootDir = Path.join(process.cwd())
const SourceDir = Path.join(RootDir, 'src')

export default defineConfig({
  build: {
    outDir: Path.join(RootDir, 'dist'),
    lib: {
      entry: Path.join(SourceDir, 'index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    minify: false,
  },
  resolve: {
    alias: {
      '@music-lyric-utils/*': Path.join(RootDir, '../'),
    },
  },
})
