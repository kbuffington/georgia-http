import { asyncReadable, asyncWritable } from '@square/svelte-store';
import { derived } from 'svelte/store';
import { refreshPlayingInfo } from '@api/backend';
import { PlaybackState, PlaylistData, PlaylistsInfo, TrackInfo, type PlayingInfo } from './types';
import { searchString } from './stores';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const playingInfo = asyncReadable(
    {},
    async () => {
        try {
            const response = await refreshPlayingInfo();
            const json = await response.json();

            return new Promise<any>(resolve => {
                const obj: PlayingInfo = json;
                obj.playbackState = new PlaybackState(json.fb, json.itemPlayingLen);
                obj.trackInfo = new TrackInfo(json.helper1, json.albumArt, json);
                obj.playlistsInfo = new PlaylistsInfo(json.playlists);
                obj.playlistData = new PlaylistData(json.playlist, obj.playlistsInfo);
                searchString.set(json.search);
                console.log(obj.playlistsInfo);
                resolve(obj);
            });
        } catch (e: any) {
            console.log(e);
            if (e.name !== 'AbortError') {
                console.warn('Theme caught error handling/parsing response');
                console.log(e.name, '>>>', e.message);
                return new Promise<any>(resolve => {
                    const obj: PlayingInfo = {} as any;
                    obj.playbackState = new PlaybackState({}, '0');
                    obj.trackInfo = new TrackInfo({}, '', {});
                    obj.playlistsInfo = new PlaylistsInfo({});
                    obj.playlistData = new PlaylistData({ js: [] }, obj.playlistsInfo);
                    resolve(obj);
                });
            } else {
                return new Promise<any>((resolve, reject) => {
                    // aborted so reject
                    reject(e);
                });
            }
        }
    },
    {
        reloadable: true,
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
            reloadable: true,
        }
    );
}
export const currentTime = createCurrentTimeStore();
