function secondsToTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.max(time - minutes * 60, 0);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
export class TrackInfo {
    artist = '';
    album = '';
    albumArtist = '';
    title = '';
    rating = '';
    ratingStars = '';
    playCount = 0;
    length = 0;
    date = '';
    tracknumber = '';
    displayLength = '';

    constructor(jsonStr: string) {
        if (jsonStr.trim().length) {
            const escaped = jsonStr.replace(/&#92;&quot;/g, '\\"').replace(/&quot;/g, '"');
            const obj = JSON.parse(escaped);
            this.artist = obj.a;
            this.album = obj.b;
            this.albumArtist = obj.aa;
            this.title = obj.t;
            this.playCount = parseInt(obj.pc);
            this.length = obj.ls;
            this.date = obj.d;
            this.rating = obj.rn;
            this.ratingStars = obj.r;
            this.tracknumber = obj.n;
            this.displayLength = secondsToTime(this.length);
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
    rating = '';
    ratingStars = '';
    title = '';
    tracknumber = '';

    constructor(json: any) {
        if (Object.keys(json)) {
            this.artist = json.a;
            this.albumArtist = json.aa;
            this.album = json.b;
            this.date = json.d;
            this.length = json.ls;
            this.displayLength = secondsToTime(this.length);
            this.playcount = parseInt(json.pc);
            this.rating = json.rn;
            this.ratingStars = json.r;
            this.title = json.t;
            this.tracknumber = json.n;
        }
    }
}

export interface PlaylistInfo {
    name: string;
    count: number;
}

export interface PlayingInfo {
    itemPlayingPos: string | number;
    itemPlayingLen: string | number;
    helper1: string;
    helper2: string;
    helper3: string;
    helper4: string;
    playlists: PlaylistInfo[];
    playlistData: PlTrackData[];
    trackInfo: TrackInfo;
}
