<script lang="ts">
    import { trackInfo } from '@stores/fb-store';
    import { artColor } from '@stores/stores';
    import { theme } from '@stores/art-store';
    import MenuSurface from '@smui/menu-surface';

    let w: number;

    function imageLoaded() {
        theme.getArtColors($trackInfo.artwork);
    }
</script>

<div
    class="mini-artwork"
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
            on:load={() => {
                imageLoaded();
            }}
        />
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
        // material design shadows
        box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%),
            0px 3px 14px 2px rgb(0 0 0 / 12%);

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
