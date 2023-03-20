import { get, writable, type StartStopNotifier } from 'svelte/store';
import storage from './persistent-store';

import { fb, currentTime, trackInfo } from '@stores/fb-store';
import { rebouncedInfoPlayingRefresh } from '@api/refresh-data';

export const routingState = writable('now-playing');
export const searchString = writable('');
export const setFocus = writable(0);
export const progressUseTransition = writable(true);

class ProgressStore {
    subscribe: StartStopNotifier<number>;
    private set: any;
    private update: any;
    private value: number;
    private interval: ReturnType<typeof setInterval> | number;

    constructor() {
        this.value = 0;
        const { subscribe, set, update } = writable(0);
        this.subscribe = subscribe;
        this.set = set;
        this.update = update;
        this.interval = 0;
    }

    updateTime(value: number) {
        this.stopUpdating();
        if (value !== undefined) {
            const trackLen = get(trackInfo).length;
            const $fb = get(fb);
            if ($fb.isStopped) {
                this.set(0);
            } else if (trackLen) {
                this.set(value / trackLen);
            }
            this.interval = setInterval(() => {
                if (value < trackLen && $fb.isPlaying) {
                    currentTime.update(n => n + 1);
                } else if (value == trackLen) {
                    rebouncedInfoPlayingRefresh();
                }
            }, 1000);
        }
    }

    public stopUpdating() {
        clearTimeout(this.interval);
    }
}

export const progressVal = new ProgressStore();

interface UserSettings {
    useMocks: boolean;
}

const defaultSettings: UserSettings = {
    useMocks: false,
};

export const userSettings = storage<UserSettings>('userSettings', defaultSettings);
