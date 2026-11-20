<script lang="ts">
    import { fb, pausedState, trackInfo } from '@stores/fb-store';
    import { theme } from '@stores/art-store';
    import PauseButton from './PauseButton.svelte';
    import { playOrPause } from '@api/commands';

    interface Props {
        hidden?: boolean;
    }

    let { hidden = true }: Props = $props();
    // Leave the width unset until it's measured: --artwidth must stay unset on first render so the
    // calc()-based `left` falls back to auto, which doesn't transition. Starting at 0 would make the
    // art slide in from the right on every load.
    let w = $state<number>();
    const artWidthStyle = $derived(w === undefined ? '' : `--artwidth:${w}px`);

    function imageLoaded(img: HTMLImageElement) {
        if ($fb.isPausedOrPlaying) {
            theme.getArtColors(img);
        }
    }
</script>

<div
    class="mini-artwork"
    class:hidden
    style="--color:{$theme.color}; --textColor:{$theme.textColor}; {artWidthStyle}"
>
    <div class="metadata">
        <div class="info">{$trackInfo.artist}</div>
        <div class="info">{$trackInfo.album}</div>
        <div class="info">{$trackInfo.date}</div>
    </div>
    <div class="art-wrapper" bind:clientWidth={w}>
        <img
            class="albumart"
            src={$trackInfo.artwork}
            alt="album art"
            onclick={playOrPause}
            onkeydown={() => {}}
            onload={evt => {
                imageLoaded(evt.currentTarget as HTMLImageElement);
            }}
        />
        {#if $pausedState}
            <PauseButton size={(w ?? 0) * 0.75} />
        {/if}
    </div>
</div>

<style lang="scss">
    @use '@css/constants.scss' as *;

    $mini-art-size: 5rem;

    .mini-artwork {
        background-color: var(--color);
        z-index: 1002; // above transport
        width: fit-content;
        display: flex;
        font-size: 13px;
        line-height: 19px;
        position: absolute;
        right: 1rem;
        top: 1.5rem;
        transition: right 1s;
        // material design shadows
        box-shadow:
            0px 5px 5px -3px rgb(0 0 0 / 20%),
            0px 8px 10px 1px rgb(0 0 0 / 14%),
            0px 3px 14px 2px rgb(0 0 0 / 12%);

        &.hidden {
            right: calc(0px - 40rem);
        }

        .metadata {
            min-width: calc(20rem - var(--artwidth));
            max-width: calc(20rem - var(--artwidth));
            padding: 0.5rem;
            color: var(--textColor);
            border-right: 1px solid rgba(0, 0, 0, 0.2);
            box-sizing: border-box;

            .info {
                margin-bottom: 0.2rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .info:last-of-type {
                margin-bottom: 0;
            }
        }

        .art-wrapper {
            cursor: pointer;
            position: relative; // so the pause overlay centers on the art, not the whole card

            img.albumart {
                max-width: calc(#{$mini-art-size} + 1.5rem);
                max-height: $mini-art-size;
                min-height: $mini-art-size;
                display: block; // fix the extra 4 pixels of parent space
            }
        }
    }
</style>
