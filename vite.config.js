import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
	plugins: [vue(), vueDevTools()],
	define: { 'process.env': {} },
	envPrefix: 'APP_',
	build: {
		minify: 'esbuild',
		sourcemap: false,
		chunkSizeWarningLimit: 5000,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		host: process.env.APP_BASE_URL || 'localhost',
		port: process.env.APP_BASE_PORT || 3000,
		watch: {
			usePolling: true,
		},
	},
})