<script lang="ts">
    import { theme } from '@stores/art-store';
    import { trackInfo } from '@stores/fb-store';
    import { onDestroy } from 'svelte';

    let firstRatio: number;
    let lastRatio: number;
    let tickRatios: number[] = [];
    let neverPlayed = true;

    const unsubscribe = trackInfo.subscribe(ti => {
        const timeInfo = ti.timeInfo;
        const added = timeInfo.added;
        const first = timeInfo.firstPlayed;
        const last = timeInfo.lastPlayed;
        const now = Date.now();

        const total = now - added;

        if (first === -1) {
            neverPlayed = true;
            firstRatio = 33;
            lastRatio = 66;
        } else {
            neverPlayed = false;
            firstRatio = Math.max((100 * (first - added)) / total, 1); // make sure to have at least 1% between added and first played
            tickRatios = timeInfo.playTimes.map(t => (100 * (t - added)) / total);
            // remove first and last in case it doesn't match other ratios
            tickRatios.pop();
            tickRatios.shift();
            lastRatio = (100 * (last - added)) / total;
        }
        console.log('ratios:', firstRatio, lastRatio);
        console.log(tickRatios);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="timeline" style="--start:{firstRatio}%; --end:{lastRatio}%;">
    <div class="timeline-bar played" class:never-played={neverPlayed} />
    <div class="timeline-bar unplayed" class:never-played={neverPlayed} />
    {#each tickRatios as t}
        <div class="tick" style="left:{t}%;" />
    {/each}
</div>

<style lang="scss">
    @import '@css/constants';

    $spacing: 0.75rem;

    .timeline {
        width: calc(100% + 2rem);
        height: $timeline-height;
        margin: $spacing 0 $spacing -1rem;
        background-color: var(--lightAccent);
        position: relative;
        box-sizing: border-box;

        .timeline-bar {
            position: absolute;
            left: 0;
            height: $timeline-height;
            border-right: 1px solid rgba(255, 255, 255, 0.5);

            &.never-played {
                border-right: none;
            }
        }
        .played {
            background-color: var(--accent);
            width: calc(var(--end));
        }
        // overlays played
        .unplayed {
            background-color: var(--darkAccent);
            width: var(--start);
        }

        .tick {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            width: 1px;
            height: $timeline-height;
        }
    }
</style>
