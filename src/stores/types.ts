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
    playcount = '';
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

export interface PlaylistData {
    name: string;
    count: number;
}

export class PlaylistsInfo {
    playlists: PlaylistData[] = [];
    playlistActive = 0;
    playlistPlaying = 0;
    playlistPlayingNumItems = 0;
    playlistPage = 0;
    playlistItemsPerPage = 0;
    playingItem = 0;
    playlistTotalTime = '';

    constructor(json: any) {
        if (json.playlists) {
            this.playlists = json.playlists.map((pl: any) => {
                return { name: pl.name, count: parseInt(pl.count) };
            });
            this.playlistActive = parseInt(json.playlistActive);
            this.playlistPlaying = parseInt(json.playlistPlaying);
            this.playlistPage = parseInt(json.playlistPage);
            this.playlistItemsPerPage = parseInt(json.playlistItemsPerPage);
            this.playlistPlayingNumItems = parseInt(json.playlistPlayingItemsCount);
            this.playingItem = parseInt(json.playingItem);
            this.playlistTotalTime = json.playlistTotalTime;
        }
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
    playlistsInfo: PlaylistsInfo;
    playlistData: PlTrackData[];
    trackInfo: TrackInfo;
}
