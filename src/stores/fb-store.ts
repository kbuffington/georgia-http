import { asyncReadable, asyncDerived, asyncWritable } from '@square/svelte-store';
import { derived, readable, writable } from 'svelte/store';
import { refreshPlayingInfo } from './backend';
import { PlaybackState, PlaylistData, PlaylistsInfo, PlTrackData, TrackInfo, type PlayingInfo } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const playingInfo = asyncReadable(
    {},
    async () => {
        try {
            console.log('here');
            const response = await refreshPlayingInfo();
            const json = await response.json();

            return new Promise<any>((resolve, reject) => {
                const obj: PlayingInfo = json;
                obj.playbackState = new PlaybackState(json.fb);
                obj.trackInfo = new TrackInfo(json.helper5, json.albumArt);
                obj.playlistsInfo = new PlaylistsInfo(json.playlists);
                obj.playlistData = new PlaylistData(json.playlist);
                console.log(obj.playlistsInfo);
                resolve(obj);
            });
        } catch (e) {
            console.warn('Caught error handling/parsing response');
            return new Promise<any>((resolve, reject) => {
                const obj: PlayingInfo = {} as any;
                obj.playbackState = new PlaybackState({});
                obj.trackInfo = new TrackInfo({}, '');
                obj.playlistsInfo = new PlaylistsInfo({});
                obj.playlistData = new PlaylistData({ js: [] });
                resolve(obj);
            });
        }
    },
    {
        reloadable: true
    }
);

export const fb = derived(playingInfo, ($playingInfo: PlayingInfo) => {
    return $playingInfo.playbackState;
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
