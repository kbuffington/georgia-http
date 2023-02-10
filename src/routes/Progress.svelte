<script lang="ts">
    import { onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { currentTime, trackInfo } from '../stores/fb-store';
    import { artColor } from '../stores/stores';

    const progress = writable(0);

    function secondsToTime(time: number) {
        const minutes = Math.floor(time/60);
        const seconds = Math.max(time - minutes * 60, 0);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    let interval: number;

    const unsubscribe = currentTime.subscribe(value => {
        clearInterval(interval);
        if (value !== undefined) {
            progress.set(value/$trackInfo.length);
            // console.log(value, $totalTime);
            interval = window.setInterval(() => {
                if (value < $trackInfo.length) {
                    currentTime.update(n => n + 1);
                }
            }, 1000);
        }
    });

    onDestroy(() => {
        clearInterval(interval);
        unsubscribe();
    });
</script>

<div id="progress-bar">
    <div class="time-bar">
    {#await currentTime.load()}
        <div class="loading">Georgia-HTTP</div>
    {:then}
        <div class="track-num">{$trackInfo.tracknumber}.</div>
        <div class="track-name">{$trackInfo.title}</div>
        <div class="elapsed">
            {secondsToTime($currentTime)}
        </div>
        <div class="total">{$trackInfo.displayLength}</div>
    {/await}
    </div>
    <progress value={$progress} style="--fill-color:{$artColor}"></progress>
</div>

<style lang="scss">
    @import "../scss/colors.scss";
    @import "../scss/constants.scss";

    #progress-bar {
        padding: 0 1rem;
    }
    .time-bar {
        display: flex;
        font-size: $progress-bar-time-font-size;

        .track-num {
            font-weight: 500;
            padding-right: 1rem;
        }
        .track-name {
            flex-grow: 1;
        }
        .elapsed, .loading {
            flex-shrink: 1;
            text-align: right;
            font-weight: 500;
        }

        .total {
            flex-shrink: 1;
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
        -webkit-appearance: none;
        border: .5px solid black;

        &::-webkit-progress-bar {
            background-color: $menu-bg;
        }
        &::-webkit-progress-value {
            background-color: var(--fill-color);
            transition: 1s linear;
        }
        &::-moz-progress-bar {
            // TODO: what goes here?
        }
    }
</style>