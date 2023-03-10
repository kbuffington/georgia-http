<script lang="ts">
    import { onDestroy } from 'svelte';
    import { fb, currentTime, trackInfo } from '@stores/fb-store';
    import { theme } from '@stores/art-store';
    import { noop } from '@api/callbacks';
    import { seekSecond } from '@api/commands';
    import { progressUseTransition, progressVal } from '@stores/stores';

    function secondsToTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.max(time - minutes * 60, 0);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    const unsubscribe = currentTime.subscribe(val => progressVal.updateTime(val));
    const unsubscribeStatus = fb.subscribe(fb => {
        if (fb.isPlaying) {
            progressVal.updateTime($currentTime);
        } else if (fb.isPaused) {
            progressVal.stopUpdating();
        } else if (fb.isStopped) {
            progressVal.stopUpdating();
        }
    });

    function handleClick(evt: MouseEvent) {
        if (!$fb.isStopped) {
            const progress = evt.target as HTMLProgressElement;
            const percentage = evt.offsetX / progress.clientWidth;
            const seconds = Math.round($trackInfo.length * percentage);
            progressUseTransition.set(false);
            progressVal.updateTime(seconds);
            seekSecond(seconds, () => {
                progressUseTransition.set(true);
            });
        }
    }

    onDestroy(() => {
        progressVal.stopUpdating();
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
    <progress
        class:transition={$progressUseTransition}
        value={$progressVal}
        on:click={handleClick}
        on:keydown={noop}
    />
</div>

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    #progress-bar {
        padding: 0 1rem;
        margin-bottom: 1.25rem;
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
            background-color: $header-bg;
        }
        &::-webkit-progress-value {
            background-color: var(--primary);
        }
        &.transition::-webkit-progress-value {
            transition: width 1s linear;
        }
    }
</style>
