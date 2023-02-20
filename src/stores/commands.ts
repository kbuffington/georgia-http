import { playingInfo } from "./fb-store";

const sendCommand = async (command: string, p1?: string|number) => {
    const url = `/georgia/?cmd=${command}${p1 ? `&param1=${p1}` : ''}`;
    await fetch(url);
    setTimeout(() => {
        playingInfo.reload!();
    }, 200);
}

export const refreshInfo = (delay = 100) => {
    setTimeout(() => {
        playingInfo.reload!();
    }, delay);
}

export const playOrPause = () => {
    sendCommand('PlayOrPause');
}

export const startNext = () => {
    sendCommand('StartNext');
}

export const startPrevious = () => {
    sendCommand('StartPrevious');
}

export const stop = () => {
    sendCommand('Stop');
}

export const setPlaylistPage = (page: number) => {
    sendCommand('P', page.toString())
}

export const switchPlaylist = (plIndex: number) => {
    sendCommand('SwitchPlaylist', plIndex);
}
