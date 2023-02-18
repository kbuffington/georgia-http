import { playingInfo } from "./fb-store";

const sendCommand = async (command: string) => {
    const url = `/georgia/?cmd=${command}`; //&param3=schema/state.json`;
    await fetch(url);
    setTimeout(() => {
        playingInfo.reload!();
    }, 200);
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
