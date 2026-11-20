// Rebuilds the static site (build/) whenever a source file changes.
//
// `vite build --watch` doesn't work with SvelteKit 2: SvelteKit rewrites its generated files in
// .svelte-kit/ on every build, which retriggers the watcher in an endless rebuild loop. Instead,
// watch the source folders ourselves and run a normal `vite build` after each change.
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const watched = ['src', 'static', 'svelte.config.js', 'vite.config.ts'];
const DEBOUNCE_MS = 300;

let building = false;
let pending = false;
let timer;

function build() {
    if (building) {
        pending = true;
        return;
    }
    building = true;
    const started = Date.now();
    console.log(`\n[build-watch] building...`);
    const child = spawn(process.execPath, [viteBin, 'build', ...process.argv.slice(2)], {
        cwd: root,
        stdio: 'inherit',
    });
    child.on('exit', code => {
        building = false;
        const secs = ((Date.now() - started) / 1000).toFixed(1);
        console.log(
            code === 0
                ? `[build-watch] build finished in ${secs}s, watching for changes...`
                : `[build-watch] build FAILED (exit ${code}), watching for changes...`
        );
        if (pending) {
            pending = false;
            build();
        }
    });
}

function scheduleBuild(path) {
    console.log(`[build-watch] changed: ${path}`);
    clearTimeout(timer);
    timer = setTimeout(build, DEBOUNCE_MS);
}

for (const target of watched) {
    watch(new URL(`../${target}`, import.meta.url), { recursive: true }, (_event, filename) =>
        scheduleBuild(filename ? `${target}/${filename}` : target)
    );
}

build();
