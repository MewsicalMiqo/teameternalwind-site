import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [svelte()],
	// relative asset paths so the build works on any subpath host
	// (GitHub Pages, Vercel, S3, file://) without repo-specific config
	base: './',
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
			$assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
		},
	},
});