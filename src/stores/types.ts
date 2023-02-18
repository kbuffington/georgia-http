function secondsToTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.max(time - minutes * 60, 0);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
export class TrackInfo {
    artist = '';
    artwork = '';
    album = '';
    albumArtist = '';
    genre = '';
    labels = '';
    title = '';
    rating = 0;
    ratingStars = '';
    playcount = 0;
    length = 0;
    date = '';
    tracknumber = '';
    displayLength = '';

    constructor(obj: any, artwork: string) {
        // if (jsonStr.trim().length) {
        // const escaped = jsonStr.replace(/&#92;&quot;/g, '\\"').replace(/&quot;/g, '"');
        // const obj = JSON.parse(escaped);
        if (Object.keys(obj)) {
            this.artist = obj.a;
            this.album = obj.b;
            this.albumArtist = obj.aa;
            this.genre = obj.g;
            this.labels = obj.l;
            this.title = obj.t;
            this.playcount = typeof obj.pc === 'number' ? obj.pc : parseInt(obj.pc); // TODO: remove
            this.length = obj.ls;
            this.date = obj.d;
            this.rating = typeof obj.rn === 'number' ? obj.rn : parseInt(obj.rn);
            this.ratingStars = obj.r;
            this.tracknumber = obj.n;
            this.displayLength = secondsToTime(this.length);
            this.artwork = artwork;
            console.log(this);
        }
    }
}

export class PlTrackData {
    artist = '';
    albumArtist = '';
    album = '';
    date = '';
    displayLength = '';
    length = 0;
    playcount = 0;
    rating = 0;
    ratingStars = '';
    ratingEmpty = '⋅⋅⋅⋅⋅';
    title = '';
    tracknumber = '';
    active = false;

    constructor(json: any, index: number, plInfo: PlaylistsInfo) {
        if (Object.keys(json)) {
            this.artist = json.a;
            this.albumArtist = json.aa;
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
            this.tracknumber = json.n;
            this.active =
                plInfo.playlistActive === plInfo.playlistPlaying &&
                plInfo.playingItem === plInfo.playlistItemsPerPage * plInfo.playlistPage + index;
        }
    }
}

export class PlaylistData {
    tracks: PlTrackData[] = [];
    focusedItem = -1;
    numItems = 0;
    page = 0;
    playingItem = -1;
    totalTime = "";

    constructor(json: any) {
        this.tracks = json.js.map((t: any, i: number) => new PlTrackData(t, i, json));
        this.page = parseInt(json.playlistPage);
        // this.playingNumItems = parseInt(json.playingNumItems);
        this.numItems = json.numItems === '?' ? 0 : parseInt(json.numItems);
        this.focusedItem = json.focused === '?' ? -1 : parseInt(json.focused);
        this.playingItem = json.itemPlaying === '?' ? -1 : parseInt(json.itemPlaying);
        this.totalTime = json.playlistTotalTime;
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
        this.playlists = json.js.map((pl: any) => {
            return { name: pl.name, count: parseInt(pl.count), locked: pl.locked };
        });
        this.playlistActive = parseInt(json.active);
        this.playlistPlaying = parseInt(json.playing);
        this.playlistItemsPerPage = parseInt(json.itemsPerPage);
    }
}

enum PlaybackStates {
    STOPPED = 0,
    PAUSED = 1,
    PLAYING = 2,
}

export class PlaybackState {
    private state: PlaybackStates = PlaybackStates.STOPPED;
    constructor(json: any) {
        if (json.isPlaying === '1') {
            this.state = PlaybackStates.PLAYING
        } else if (json.isPaused === '1') {
            this.state = PlaybackStates.PAUSED
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
}

export interface PlayingInfo {
    itemPlayingPos: string | number;
    itemPlayingLen: string | number;
    helper1: string;
    helper2: string;
    helper3: string;
    helper4: string;
    helper5: string;
    albumArt: string;
    playbackState: PlaybackState;
    playlistsInfo: PlaylistsInfo;
    playlistData: PlaylistData;
    trackInfo: TrackInfo;
}
