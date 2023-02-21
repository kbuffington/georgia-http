import { playingInfo } from '@stores/fb-store';
import { PlayingInfoRefresher } from './refresh-data';

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
