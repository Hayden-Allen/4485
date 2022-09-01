import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      backend: 'src/backend',
      frontend: 'src/frontend',
      components: 'src/frontend/components',
      models: 'src/backend/models',
      routes: 'src/frontend/routes',
      tailwind: 'src/frontend/tailwind',
      icons: 'src/frontend/icons',
      '%engine': 'src/frontend/engine',
      '%component': 'src/frontend/engine/component',
      '%editor': 'src/frontend/engine/editor',
      '%script': 'src/frontend/engine/script',
      '%system': 'src/frontend/engine/system',
      '%util': 'src/frontend/engine/util',
      '%window': 'src/frontend/engine/window',
    },
    files: {
      routes: 'src/frontend/routes',
    },
  },
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
}

export default config
