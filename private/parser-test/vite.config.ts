import { join } from 'node:path'

import { defineConfig } from 'vite'

const root = join(process.cwd())
const src = join(root, 'src')

export default defineConfig({
  root: src,
  build: {
    outDir: join(root, 'dist'),
    lib: {
      entry: join(src, 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    minify: false,
    reportCompressedSize: false,
  },
  server: {
    port: 9090,
    strictPort: false,
  },
})
