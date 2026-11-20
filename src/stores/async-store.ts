/**
 * Minimal replacement for the subset of @square/svelte-store this app uses
 * (that library does not support Svelte 5). Behaviour mirrors the original:
 *  - stores load lazily on first subscribe or on `load()`, and `load()` returns the cached promise
 *  - `reload()` forces the load function to run again
 *  - a load rejected with an AbortError keeps the current value
 *  - derived async stores only re-run when their parent's value actually changes (JSON compare)
 */
import { get, writable, type Readable } from 'svelte/store';

export interface Loadable<T> extends Readable<T> {
    load(): Promise<T>;
    reload?(): Promise<T>;
}

export interface WritableLoadable<T> extends Loadable<T> {
    set(value: T): Promise<void>;
    update(updater: (value: T) => T): Promise<void>;
}

const isAbortError = (e: unknown) => (e as Error)?.name === 'AbortError';

const loadParent = <P>(parent: Readable<P> | undefined): Promise<P | undefined> => {
    if (!parent) return Promise.resolve(undefined);
    if ('load' in parent && typeof (parent as Loadable<P>).load === 'function') {
        return (parent as Loadable<P>).load();
    }
    return Promise.resolve(get(parent));
};

const reloadParent = <P>(parent: Readable<P> | undefined): Promise<P | undefined> => {
    const reload = (parent as Loadable<P> | undefined)?.reload;
    return reload ? reload.call(parent) : loadParent(parent);
};

interface AsyncOptions<T> {
    initial?: T;
    reloadable?: boolean;
}

export function asyncWritable<P, T>(
    parent: Readable<P> | undefined,
    mappingLoad: (parentValue: P) => Promise<T>,
    mappingWrite?: (value: T) => Promise<void>,
    options: AsyncOptions<T> = {}
): WritableLoadable<T> {
    const { reloadable, initial } = options;
    let loadedValuesString: string | undefined;
    let currentLoadPromise: Promise<T> | undefined;

    // eslint-disable-next-line prefer-const
    let loadThenSet: (loadFn: typeof loadParent, forceReload?: boolean) => Promise<T>;

    const store = writable<T>(initial as T, () => {
        loadThenSet(loadParent).catch(() => undefined);
        const unsubscribe = parent?.subscribe(() => {
            loadThenSet(loadParent).catch(() => undefined);
        });
        return () => unsubscribe?.();
    });

    loadThenSet = async (loadFn, forceReload = false) => {
        const parentLoad = loadFn(parent);
        try {
            await parentLoad;
        } catch {
            currentLoadPromise = parentLoad as Promise<never>;
            return currentLoadPromise;
        }
        const parentValue = parent ? get(parent) : undefined;
        if (!forceReload) {
            const newValuesString = JSON.stringify(parent ? [parentValue] : []);
            if (newValuesString === loadedValuesString && currentLoadPromise) {
                return currentLoadPromise;
            }
            loadedValuesString = newValuesString;
        }
        const loadAndSet = async () => {
            try {
                const value = await mappingLoad(parentValue as P);
                store.set(value);
                return value;
            } catch (e) {
                if (isAbortError(e)) {
                    return get(store);
                }
                throw e;
            }
        };
        currentLoadPromise = loadAndSet();
        return currentLoadPromise;
    };

    const setThenWrite = async (updater: (value: T) => T) => {
        let oldValue: T;
        try {
            oldValue = await loadThenSet(loadParent);
        } catch {
            oldValue = get(store);
        }
        const newValue = updater(oldValue);
        currentLoadPromise = (currentLoadPromise ?? Promise.resolve(newValue))
            .then(() => newValue)
            .catch(() => newValue);
        store.set(newValue);
        await mappingWrite?.(newValue);
    };

    const load = () => loadThenSet(loadParent);
    const reload = () => loadThenSet(reloadParent, !!reloadable);

    return {
        subscribe: store.subscribe,
        set: (value: T) => setThenWrite(() => value),
        update: (updater: (value: T) => T) => setThenWrite(updater),
        load,
        reload,
    };
}

export function asyncReadable<T>(
    initial: T,
    loadFunction: () => Promise<T>,
    options: Omit<AsyncOptions<T>, 'initial'> = {}
): Loadable<T> {
    const { subscribe, load, reload } = asyncWritable<undefined, T>(
        undefined,
        loadFunction,
        undefined,
        { ...options, initial }
    );
    return { subscribe, load, reload };
}

/**
 * Returns a debounced version of `callback`. Each call cancels any pending call, whose promise
 * rejects with an AbortError. The callback runs `delay` ms after the most recent call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rebounce<Args extends any[], R>(
    callback: (...args: Args) => R | Promise<R>,
    delay = 0
) {
    let previousReject: ((reason: unknown) => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const abort = () =>
        previousReject?.(new DOMException('The function was rebounced.', 'AbortError'));

    const rebounced = (...args: Args): Promise<R> => {
        abort();
        clearTimeout(timer);
        return new Promise<R>((resolve, reject) => {
            previousReject = reject;
            timer = setTimeout(async () => {
                try {
                    resolve(await callback(...args));
                } catch (e) {
                    reject(e);
                }
            }, delay);
        });
    };
    rebounced.clear = () => {
        clearTimeout(timer);
        abort();
        timer = undefined;
        previousReject = undefined;
    };
    return rebounced;
}
