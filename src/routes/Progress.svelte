<script lang="ts">
    import { onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { fb, currentTime, trackInfo } from '@stores/fb-store';
    import { artColor } from '@stores/stores';
    import { PlayingInfoRefresher } from '@api/refresh-data';

    const progress = writable(0);

    function secondsToTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.max(time - minutes * 60, 0);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    let interval: number | any;

    function updateTime(value: number) {
        clearTimeout(interval);
        if (value !== undefined) {
            if ($fb.isStopped) {
                progress.set(0);
            } else if ($trackInfo.length) {
                progress.set(value / $trackInfo.length);
            }
            interval = setInterval(() => {
                if (value < $trackInfo.length && $fb.isPlaying) {
                    currentTime.update(n => n + 1);
                } else if (value == $trackInfo.length) {
                    PlayingInfoRefresher.refreshRebounced();
                }
            }, 1000);
        }
    }

    const unsubscribe = currentTime.subscribe(updateTime);
    const unsubscribeStatus = fb.subscribe(fb => {
        console.log(fb.isPlaying);
        if (fb.isPlaying) {
            updateTime($currentTime);
        } else if (fb.isPaused) {
            clearTimeout(interval);
        } else if (fb.isStopped) {
            clearTimeout(interval);
        }
    });

    onDestroy(() => {
        clearTimeout(interval);
        unsubscribe();
        unsubscribeStatus();
    });
</script>

<div id="progress-bar">
    <div class="time-bar">
        {#await currentTime.load()}
            <div class="loading">Georgia-HTTP</div>
        {:then}
            {#if !$fb.isStopped}
                <div class="track-num">{$trackInfo.tracknumber}.</div>
                <div class="track-name">{$trackInfo.title}</div>
                <div class="elapsed">
                    {secondsToTime($currentTime)}
                </div>
                <div class="total">{$trackInfo.displayLength}</div>
            {:else}
                <div class="loading">Georgia-HTTP</div>
            {/if}
        {/await}
    </div>
    <progress value={$progress} style="--fill-color:{$artColor}" />
</div>

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    #progress-bar {
        padding: 0 1rem;
    }
    .time-bar {
        display: flex;
        font-size: $progress-bar-time-font-size;
        padding: 2px;
        margin-bottom: 2px;

        .track-num {
            font-weight: 500;
            padding-right: 1rem;
        }
        .track-name {
            font-weight: 300;
            flex-grow: 1;
        }
        .elapsed,
        .loading {
            flex-shrink: 1;
            text-align: right;
            font-weight: 500;
        }

        .total {
            flex-shrink: 1;
            font-weight: 100;
            margin-left: 1rem;
        }

        .loading {
            font-weight: 300;
            color: $dim-text;
        }
    }

    progress {
        display: block;
        width: 100%;
        height: $progress-bar-height;
        appearance: none;
        -webkit-appearance: none;
        border: 0.5px solid black;

        &::-webkit-progress-bar {
            background-color: $menu-bg;
        }
        &::-webkit-progress-value {
            background-color: var(--fill-color);
            transition: 1s linear;
        }
    }
</style>
