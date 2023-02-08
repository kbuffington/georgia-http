import { asyncReadable, asyncDerived, asyncWritable } from '@square/svelte-store';
import { derived, readable, writable } from 'svelte/store';
import { refreshPlayingInfo } from './fake-backend';
import type { PlayingInfo } from './types';

// const numericParams = [
//     'itemPlayingLen',
//     'itemPlayingPos',
// ]

export const playingInfo = asyncReadable({}, async () => {
    const response = await refreshPlayingInfo();
    return response.json();
});

export const totalTime = derived(playingInfo,
    ($playingInfo: PlayingInfo) => {
        return parseInt($playingInfo.itemPlayingLen as string);
});

export const trackName = derived(playingInfo,
    ($playingInfo: PlayingInfo) => {
        return $playingInfo.helper2;
});

function createCurrentTimeStore() {
    let _time = 0;
    return asyncWritable(
        playingInfo,
        async ($playingInfo: PlayingInfo) => {
            _time = parseInt($playingInfo.itemPlayingPos as string);
            return _time;
        },
        async (time: number) => {
            _time = time;
        },
        {
            reloadable: true
        }
    );
}
export const currentTime = createCurrentTimeStore();

function createFoobarStore() {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
        init: () => {
            fetch(`http://date.jsontest.com/`)
                .then(resp => resp.json())
                .then(data => set(JSON.stringify(data)))
                .catch(error => set(error.message))
        }
	};
}

export const fbStore = createFoobarStore();