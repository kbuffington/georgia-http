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
    p3?: string
) => {
    if (!p3) {
        p3 = 'NoResponse';
    }
    await sendCommand(command, p1, p2, p3);
    rebouncedInfoPlayingRefresh();
};

export const playOrPause = () => {
    sendCommandAndRefresh('PlayOrPause');
};

export const startNext = () => {
    sendCommandAndRefresh('StartNext');
};

export const startPrevious = () => {
    sendCommandAndRefresh('StartPrevious');
};

export const stop = () => {
    sendCommandAndRefresh('Stop');
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

const searchLibrary = (searchStr: string) => {
    sendCommandAndRefresh('SearchMediaLibrary', searchStr);
};

export const librarySearch = debounce(searchLibrary, 250);
