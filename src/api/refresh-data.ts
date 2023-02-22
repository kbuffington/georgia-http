import { rebounce } from '@square/svelte-store';
import { playingInfo } from '@stores/fb-store';

// let lastRefreshed = 0;

class RefreshDataInstance {
    // public refreshRebounced;
    private lastRefreshed = 0;
    private refreshInterval: ReturnType<typeof setInterval> | undefined = undefined;

    constructor() {
        this.updateInterval();
    }

    public async refresh() {
        await playingInfo.load();
        playingInfo.reload!(); // eslint-disable-line
        this.updateInterval();
    }

    public updateInterval() {
        clearInterval(this.refreshInterval);
        this.lastRefreshed = Date.now();
        this.refreshInterval = setInterval(() => {
            console.log(`last refresh was: ${(Date.now() - this.lastRefreshed) / 1000}s ago`);
            if (Date.now() > this.lastRefreshed + 59 * 1000) {
                this.refresh();
            } else {
                this.updateInterval();
            }
        }, 60 * 1000);
    }
}

export const PlayingInfoRefresher = new RefreshDataInstance();
export const rebouncedInfoPlayingRefresh = rebounce(async () => {
    await PlayingInfoRefresher.refresh();
    PlayingInfoRefresher.updateInterval();
}, 200);

export const visibilityChanged = (visible: boolean) => {
    if (visible) {
        PlayingInfoRefresher.refresh();
    }
};
