import { join } from 'node:path'

import { defineConfig, mergeConfig, type UserConfig } from 'vite'

const root = join(process.cwd())
const src = join(root, 'src')

const DefaultConfig = defineConfig({
  root,
  build: {
    outDir: join(root, 'dist'),
    lib: {
      entry: join(src, 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    minify: false,
    reportCompressedSize: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@root': src,
    },
  },
})

export const generateConfig = (config: UserConfig, mergeDefault: boolean = true) => {
  return mergeDefault ? mergeConfig(DefaultConfig, config) : config
}
