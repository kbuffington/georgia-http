import { rebounce } from '@square/svelte-store';
import { playingInfo } from '@stores/fb-store';

class RefreshDataInstance {
    public refreshRebounced;
    // private lastRefreshed = 0;

    constructor() {
        this.refreshRebounced = rebounce(this.refresh, 200);
    }

    public async refresh() {
        await playingInfo.load();
        playingInfo.reload!(); // eslint-disable-line
        // this.lastRefreshed = Date.now();
    }
}

export const PlayingInfoRefresher = new RefreshDataInstance();

export const visibilityChanged = (visible: boolean) => {
    if (visible) {
        PlayingInfoRefresher.refresh();
    }
};
