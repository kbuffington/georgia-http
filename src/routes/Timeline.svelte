<script lang="ts">
    import { theme } from '@stores/art-store';
    import { trackInfo } from '@stores/fb-store';
    import { onDestroy } from 'svelte';

    let firstRatio: number;
    let lastRatio: number;
    let tickRatios: number[] = [];

    const unsubscribe = trackInfo.subscribe(ti => {
        const timeInfo = ti.timeInfo;
        const added = timeInfo.added;
        const first = timeInfo.firstPlayed;
        const last = timeInfo.lastPlayed;
        const now = Date.now();

        const total = now - added;

        firstRatio = Math.max((100 * (first - added)) / total, 1); // make sure to have at least 1% between added and first played
        tickRatios = timeInfo.playTimes.map(t => (100 * (t - added)) / total);
        // remove first and last in case it doesn't match other ratios
        tickRatios.pop();
        tickRatios.shift();
        lastRatio = (100 * (last - added)) / total;
        console.log('ratios:', firstRatio, lastRatio);
        console.log(tickRatios);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div
    class="timeline"
    style="--start:{firstRatio}%; --end:{lastRatio}%; --dark:{$theme.darkAccent
        .hex}; --accent:{$theme.accent.hex}; --light:{$theme.lightAccent.hex};"
>
    <div class="played" />
    <div class="unplayed" />
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
        background-color: var(--light);
        position: relative;
        box-sizing: border-box;

        .played {
            position: absolute;
            background-color: var(--accent);
            height: $timeline-height;
            // top: calc(0px - #{$timeline-height});
            left: 0;
            width: calc(var(--end));
            border-right: 1px solid rgba(255, 255, 255, 0.5);
        }
        // overlays played
        .unplayed {
            position: absolute;
            background-color: var(--dark);
            height: $timeline-height;
            left: 0;
            width: var(--start);
            border-right: 1px solid rgba(255, 255, 255, 0.5);
        }

        .tick {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            width: 1px;
            height: $timeline-height;
        }
    }
</style>
