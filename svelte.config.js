import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';


/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false,
            strict: true
        }),
        paths: {
            base: '/georgia',
        },
        alias: {
            // these are the aliases and paths to them
            '@api': path.resolve('./src/api'),
            '@components': path.resolve('./src/components'),
            '@css': path.resolve('./src/scss'),
            '@stores': path.resolve('./src/stores'),
        }
    }
};

export default config;
