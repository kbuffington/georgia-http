import { PlayingInfoRefresher } from './refresh-data';

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

const sendCommand = async (command: string, p1?: string | number) => {
    const url = `/georgia/?cmd=${command}${p1 !== undefined ? `&param1=${p1}` : ''}`;
    await fetch(url);
    PlayingInfoRefresher.refreshRebounced();
};

export const playOrPause = () => {
    sendCommand('PlayOrPause');
};

export const startNext = () => {
    sendCommand('StartNext');
};

export const startPrevious = () => {
    sendCommand('StartPrevious');
};

export const stop = () => {
    sendCommand('Stop');
};

export const setPlaylistPage = (page: number) => {
    sendCommand('P', page.toString());
};

export const switchPlaylist = (plIndex: number) => {
    sendCommand('SwitchPlaylist', plIndex);
};

export const playPlaylistItem = (index: number) => {
    sendCommand('Start', index);
};

const searchLibrary = (searchStr: string) => {
    sendCommand('SearchMediaLibrary', searchStr);
};

export const librarySearch = debounce(searchLibrary, 250);
