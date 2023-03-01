import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    plugins: [sveltekit()],
    // optimizeDeps: {
    // 	exclude: ['extract-colors']
    // }
};

export default config;
