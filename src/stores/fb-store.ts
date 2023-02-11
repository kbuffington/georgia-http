import { asyncReadable, asyncDerived, asyncWritable } from '@square/svelte-store';
import { derived, readable, writable } from 'svelte/store';
import { refreshPlayingInfo } from './fake-backend';
import { PlaylistsInfo, PlTrackData, TrackInfo, type PlayingInfo } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const playingInfo = asyncReadable({}, async () => {
    const response = await refreshPlayingInfo();
    const json = await response.json();
    return new Promise<any>((resolve, reject) => {
        const obj: PlayingInfo = json;
        obj.trackInfo = new TrackInfo(json.helper5, json.albumArt);
        obj.playlistsInfo = new PlaylistsInfo(json);
        obj.playlistData = json.playlist.map((t: any, i: number) => new PlTrackData(t, i, obj.playlistsInfo));
        console.log(obj.playlistsInfo);
        resolve(obj);
    });
});

export const playlistData = derived(playingInfo, ($playingInfo: PlayingInfo) => {
    return $playingInfo.playlistData;
});

export const playlistsInfo = derived(playingInfo, ($playingInfo: PlayingInfo) => {
    return $playingInfo.playlistsInfo;
});

export const trackInfo = derived(playingInfo, ($playingInfo: PlayingInfo) => {
    return $playingInfo.trackInfo;
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
                .catch(error => set(error.message));
        }
    };
}

export const fbStore = createFoobarStore();
