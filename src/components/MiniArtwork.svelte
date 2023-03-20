<script lang="ts">
    import { fb, trackInfo } from '@stores/fb-store';
    import { theme } from '@stores/art-store';
    import PauseButton from './PauseButton.svelte';
    import { playOrPause } from '@api/commands';

    export let hidden = true;
    let w: number;

    function imageLoaded() {
        theme.getArtColors($trackInfo.artwork);
    }
</script>

<div
    class="mini-artwork"
    class:hidden
    style="--color:{$theme.color}; --textColor:{$theme.textColor}; --artwidth:{w}px"
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
            on:click={playOrPause}
            on:keydown={() => {}}
            on:load={() => {
                imageLoaded();
            }}
        />
        {#if $fb.isPaused}
            <PauseButton size={w * 0.75} />
        {/if}
    </div>
</div>

<style lang="scss">
    @import '@css/constants.scss';

    $mini-art-size: 5rem;

    .mini-artwork {
        background-color: var(--color);
        z-index: 1000;
        width: fit-content;
        display: flex;
        font-size: 13px;
        line-height: 19px;
        position: absolute;
        right: 1rem;
        top: 1.5rem;
        transition: right 1s;
        // material design shadows
        box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%),
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

        img.albumart {
            max-width: calc(#{$mini-art-size} + 1.5rem);
            max-height: $mini-art-size;
            min-height: $mini-art-size;
            display: block; // fix the extra 4 pixels of parent space
        }
    }
</style>
