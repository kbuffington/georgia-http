import { rebouncedInfoPlayingRefresh } from './refresh-data';

export function debounce<T extends unknown[], U>(
    callback: (...args: T) => PromiseLike<U> | U,
    wait: number
) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: T): Promise<U> => {
        clearTimeout(timer);
        return new Promise(resolve => {
            timer = setTimeout(() => resolve(callback(...args)), wait);
        });
    };
}

export const sendCommand = (
    command: string,
    p1?: string | number,
    p2?: string | number,
    p3?: string
) => {
    const url =
        `${window?.location.origin}/georgia/?cmd=${command}` +
        `${p1 !== undefined ? `&param1=${p1}` : ''}` +
        `${p2 !== undefined ? `&param2=${p2}` : ''}` +
        `${p3 !== undefined ? `&param3=${p3}` : ''}`;
    return fetch(url);
};

const sendCommandAndRefresh = async (
    command: string,
    p1?: string | number,
    p2?: string | number,
    p3?: string,
    cb?: () => void
) => {
    if (!p3) {
        p3 = 'NoResponse';
    }
    await sendCommand(command, p1, p2, p3);
    await rebouncedInfoPlayingRefresh();
    if (cb) {
        cb();
    }
};

export const playOrPause = () => {
    sendCommandAndRefresh('PlayOrPause');
};

export const startNext = (cb: () => void) => {
    sendCommandAndRefresh('StartNext', undefined, undefined, undefined, cb);
};

export const startPrevious = (cb: () => void) => {
    sendCommandAndRefresh('StartPrevious', undefined, undefined, undefined, cb);
};

export const stop = (cb: () => void) => {
    sendCommandAndRefresh('Stop', undefined, undefined, undefined, cb);
};

export const seekSecond = (seconds: number, cb: () => void) => {
    sendCommandAndRefresh('SeekSecond', seconds, undefined, undefined, cb);
};

export const setPlaylistPage = (page: number) => {
    sendCommandAndRefresh('P', page.toString());
};

export const switchPlaylist = (plIndex: number) => {
    sendCommandAndRefresh('SwitchPlaylist', plIndex);
};

export const playPlaylistItem = (index: number) => {
    sendCommandAndRefresh('Start', index);
};

export const setPlaylistItemsPerPage = (numItems: number) => {
    numItems = Math.max(10, Math.min(numItems, 60));
    sendCommandAndRefresh('PlaylistItemsPerPage', numItems);
};

const searchLibrary = (searchStr: string) => {
    sendCommandAndRefresh('SearchMediaLibrary', searchStr);
};

export const librarySearch = debounce(searchLibrary, 250);

export const queueItems = (items: number[]) => {
    sendCommandAndRefresh('QueueItems', items.join(','));
};

export const dequeueItems = (items: number[]) => {
    sendCommandAndRefresh('DequeueItems', items.join(','));
};

export const deleteItems = (items: number[]) => {
    sendCommandAndRefresh('Del', items.join(','));
};

export const moveItems = (items: number[], diff: number) => {
    sendCommandAndRefresh('Move', items.join(','), diff);
};

export const setFocus = (item: number) => {
    sendCommand('SetFocus', item);
};
