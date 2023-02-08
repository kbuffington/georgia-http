<script>
    import { onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { currentTime, totalTime, trackName } from '../stores/fb-store';
    import { artColor } from '../stores/stores';

    const progress = writable(0);

    function secondsToTime(time) {
        const minutes = Math.floor(time/60);
        const seconds = Math.max(time - minutes * 60, 0);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    let interval;

    const unsubscribe = currentTime.subscribe(value => {
        clearInterval(interval);
        if (value !== undefined) {
            progress.set(value/$totalTime);
            // console.log(value, $totalTime);
            interval = setInterval(() => {
                if (value < $totalTime) {
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
        <div class="track-name">{$trackName}</div>
        <div class="elapsed">
            {secondsToTime($currentTime)}
        </div>
        <div class="total">{secondsToTime($totalTime)}</div>
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