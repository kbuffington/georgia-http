import { loadCountryFlags } from '@api/country';
import { convertToRoman } from '@api/helpers';

function secondsToTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.max(time - minutes * 60, 0);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

class PlayTimeInfo {
    added = -1;
    firstPlayed = -1;
    lastPlayed = -1;
    playTimes: number[] = [];

    constructor(json: any) {
        if (Object.keys(json).length) {
            this.added = !json.add || json.add === 'N/A' ? -1 : new Date(json.add).getTime();
            this.firstPlayed = !json.fp || json.fp === 'N/A' ? -1 : new Date(json.fp).getTime();
            this.lastPlayed = !json.lp || json.lp === 'N/A' ? -1 : new Date(json.lp).getTime();
            // round times to nearest minute
            const playTimes = json.fbpt.map((t: number) => Math.floor(t / 60000) * 60000);
            const lfm = json.lfmpt.map((t: number) => Math.floor(t / 60000) * 60000);
            // remove duplicates
            this.playTimes = [...new Set([...playTimes, ...lfm])].sort((a, b) => a - b);
        }
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class TrackInfo {
    artist = '';
    artwork = '';
    album = '';
    albumArtist = '';
    artistCountryFlags: string[] = [];
    added = '';
    discart = '';
    codecInfo = '';
    genre: string[] = [];
    labels: string[] = [];
    title = '';
    rating = 0;
    ratingStars = '';
    playcount = 0;
    playtimes: number[] = [];
    timeInfo: PlayTimeInfo = new PlayTimeInfo({});
    lastPlayed = '';
    length = 0;
    date = '';
    year = '';
    tracknumber = '';
    displayLength = '';

    constructor(obj: any, artwork: string, discart: string, json: any) {
        if (Object.keys(obj).length) {
            this.artist = obj.a ?? '';
            this.album = obj.b ?? '';
            this.albumArtist = obj.aa ?? '';
            this.artistCountryFlags = obj.ac ? loadCountryFlags(obj.ac) : [];
            this.genre = obj.g ? obj.g.split(';') : [];
            this.labels = obj.l ? obj.l.split(';') : [];
            this.title = obj.t;
            this.playcount = typeof obj.pc === 'number' ? obj.pc : parseInt(obj.pc); // TODO: remove
            this.length = obj.ls;
            this.date = obj.d;
            this.rating = typeof obj.rn === 'number' ? obj.rn : parseInt(obj.rn);
            this.ratingStars = obj.r;
            this.tracknumber = obj.n;
            this.displayLength = secondsToTime(this.length);
            this.artwork = artwork;
            this.discart = discart;
            if (Object.keys(json).length) {
                this.year = json.helper2;
                this.codecInfo = json.helper3
                    ?.replace('DCA (DTS Coherent Acoustics)', 'dts')
                    .replace(' | stereo', '');
                if (json.helper4) {
                    this.timeInfo = new PlayTimeInfo(json.helper4);
                }
                this.added = json.helper5;
                this.lastPlayed = json.helper6;
            }
            console.log(this);
        }
    }
}

export class PlTrackData {
    artist = '';
    albumArtist = '';
    featured = '';
    album = '';
    date = '';
    displayLength = '';
    length = 0;
    playcount = 0;
    plIndex = -1; // real index of this track in the playlist
    rating = 0;
    ratingStars = '';
    ratingEmpty = '⋅⋅⋅⋅⋅';
    title = '';
    discNumber = '';
    queueIndexes = '';
    tracknumber = '';
    active = false;
    focused = false;
    selected = false;

    constructor(json: any, index: number, plInfo: PlaylistsInfo, pData: PlaylistData) {
        if (Object.keys(json)) {
            this.artist = json.a;
            this.albumArtist = json.aa;
            if (this.artist.startsWith(this.albumArtist)) {
                this.featured = this.artist.replace(this.albumArtist, '').trim();
            } else if (
                this.albumArtist === 'Various Artists' ||
                this.albumArtist === 'Soundtrack'
            ) {
                this.featured = this.artist;
            }
            this.album = json.b;
            this.date = json.d;
            this.length = json.ls;
            this.displayLength = secondsToTime(this.length);
            this.playcount = typeof json.pc === 'number' ? json.pc : parseInt(json.pc);
            this.rating = json.rn ? parseInt(json.rn) : 0;
            // const fill = '\u00B7'; // · (middle dot)
            const fill = '\u2219'; // ⋅ (bullet operator)
            // const fill = '\u2616'; // ☆ (White Star)
            this.ratingStars = '★'.repeat(this.rating); //.padEnd(5, fill);
            // this.ratingStars = json.r.padEnd(5, '\u2219');
            this.ratingEmpty = fill.repeat(5 - this.rating);
            this.title = json.t;
            this.discNumber = json.dn > 0 ? `${convertToRoman(json.dn)}-` : '';
            this.queueIndexes = json.qi ?? '';
            this.tracknumber = json.n;
            this.plIndex = plInfo.playlistItemsPerPage * (pData.page - 1) + index;
            this.active =
                plInfo.playlistActive === plInfo.playlistPlaying &&
                pData.playingItem === this.plIndex;
            this.focused = pData.focusedItem === this.plIndex;
        }
    }
}

export class PlaylistData {
    tracks: PlTrackData[] = [];
    locked = false;
    focusedItem = -1;
    numItems = 0;
    page = 1;
    pages = 1;
    playingItem = -1;
    totalTime = '';

    constructor(json: any, pi: PlaylistsInfo) {
        this.page = json.page === 0 ? 1 : parseInt(json.page);
        this.pages = parseInt(json.pages);
        // this.playingNumItems = parseInt(json.playingNumItems);
        this.numItems = json.numItems === '?' ? 0 : json.numItems;
        this.focusedItem = json.focused === '?' ? -1 : json.focused;
        this.playingItem = json.itemPlaying === '?' ? -1 : json.itemPlaying;
        this.totalTime = json.totalTime;
        if (pi.playlists.length) {
            this.locked = pi.playlists[pi.playlistActive].locked;
        }
        this.tracks = json.js.map((t: any, i: number) => new PlTrackData(t, i, pi, this));
    }
}

export interface PlaylistEntry {
    name: string;
    count: number;
    locked: boolean;
}

export class PlaylistsInfo {
    playlists: PlaylistEntry[] = [];
    playlistActive = -1;
    playlistPlaying = -1;
    playlistItemsPerPage = 0;
    // playlistPlayingNumItems = 0;
    // playlistPage = 0;
    // playingItem = 0;
    // playlistTotalTime = '';

    constructor(json: any) {
        if (JSON.stringify(json) !== '{}') {
            this.playlists = json.js.map((pl: any) => {
                return { name: pl.name, count: pl.count, locked: pl.locked };
            });
            this.playlistActive = json.active;
            this.playlistPlaying = json.playing;
            this.playlistItemsPerPage = json.itemsPerPage;
        }
    }
}

enum PlaybackStates {
    STOPPED = 0,
    PAUSED = 1,
    PLAYING = 2,
}

export class PlaybackState {
    private state: PlaybackStates = PlaybackStates.STOPPED;

    constructor(json: any, itemPlaylingLen: number) {
        if (itemPlaylingLen == 0) {
            // sometimes isPlaying is true but there's no length
            this.state = PlaybackStates.STOPPED;
        } else if (json.isPlaying === 1) {
            this.state = PlaybackStates.PLAYING;
        } else if (json.isPaused === 1) {
            this.state = PlaybackStates.PAUSED;
        }
    }

    get isPlaying() {
        return this.state === PlaybackStates.PLAYING;
    }

    get isPaused() {
        return this.state === PlaybackStates.PAUSED;
    }

    get isStopped() {
        return this.state === PlaybackStates.STOPPED;
    }

    get isPausedOrPlaying() {
        return this.state !== PlaybackStates.STOPPED;
    }
}

export interface PlayingInfo {
    itemPlayingPos: string | number;
    itemPlayingLen: string | number;
    helper2: string;
    helper3: string;
    helper4: string;
    helper5: string;
    helper6: string;
    helper7: string;
    helper8: string;
    helper9: string;
    albumArt: string;
    playbackState: PlaybackState;
    playlistsInfo: PlaylistsInfo;
    playlistData: PlaylistData;
    trackInfo: TrackInfo;
}

export interface QueryResponse {
    query: string[];
    queryInfo: string[];
}
