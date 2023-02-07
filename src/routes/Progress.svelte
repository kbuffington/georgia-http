<script>
    import { onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { currentTime, totalTime } from '../stores/fb-store';

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

<div class="time-bar">
{#await currentTime.load()}
    <div class="loading">Georgia-HTTP</div>
{:then}
    <div class="elapsed">
        {secondsToTime($currentTime)}
    </div>
    <div class="total">{secondsToTime($totalTime)}</div>
{/await}
</div>
<progress value={$progress}></progress>

<style lang="scss">
    @import "../scss/colors.scss";

    .time-bar {
        display: flex;
        font-size: 2rem;

        .elapsed, .loading {
            flex-grow: 1;
            text-align: right;
            font-weight: 500;
        }

        .total {
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
        height: 1.5rem;
        -webkit-appearance: none;
        border: .5px solid black;

        &::-webkit-progress-bar {
            background-color: $menu-bg;
        }
        &::-webkit-progress-value {
            background-color: blue;
        }
        &::-moz-progress-bar {
            // TODO: what goes here?
        }
    }
</style>