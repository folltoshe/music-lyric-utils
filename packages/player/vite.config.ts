import { join } from 'node:path'

import { defineConfig } from 'vite'

import PluginDts from 'vite-plugin-dts'

const root = join(process.cwd())
const src = join(root, 'src')

export default defineConfig({
  root,
  build: {
    outDir: join(root, 'dist'),
    lib: {
      entry: join(src, 'index.ts'),
      formats: ['es', 'cjs', 'iife'],
      name: 'MuricLyricPlayer',
      fileName: 'index',
    },
    minify: false,
    reportCompressedSize: false,
  },
  resolve: {
    alias: {
      '@root': src,
    },
  },
  plugins: [PluginDts({ rollupTypes: true })],
})
