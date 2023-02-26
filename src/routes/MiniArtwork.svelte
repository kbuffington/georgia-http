<script lang="ts">
    import { extractColors } from 'extract-colors';
    import { trackInfo } from '@stores/fb-store';
    import { artColor } from '@stores/stores';
    import MenuSurface from '@smui/menu-surface';

    let w: number;

    const extractOptions = {
        pixels: 10000,
        distance: 0.1,
        splitPower: 10,
        colorValidator: (red: number, green: number, blue: number, alpha = 255) => alpha > 250,
        saturationDistance: 0.1,
        lightnessDistance: 0.1,
        hueDistance: 0.063333333,
    };

    function imageLoaded() {
        extractColors($trackInfo.artwork, extractOptions)
            .then(c => {
                const sortedCols = c.sort((a, b) => b.area - a.area).filter(c => c.lightness < 0.7);
                console.log(sortedCols[0].hex, sortedCols[0].area, sortedCols);
                artColor.set(sortedCols[0].hex);
            })
            .catch(console.error);
    }
</script>

<div class="mini-artwork" style="--color:{$artColor}; --artwidth:{w}px">
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
            min-width: calc(20vw - var(--artwidth));
            max-width: calc(20vw - var(--artwidth));
            padding: 0.5rem;

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
