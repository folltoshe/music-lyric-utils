import { generateConfig } from '../../private/config/vite'

import PluginDts from 'vite-plugin-dts'

export default generateConfig({
  plugins: [PluginDts({ rollupTypes: true })],
})
