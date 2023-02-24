<script lang="ts">
    import { extractColors } from 'extract-colors';
    import { trackInfo } from '@stores/fb-store';
    import { artColor } from '@stores/stores';

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
                const sortedCols = c.sort((a, b) => b.area - a.area);
                console.log(sortedCols[0].hex, sortedCols[0].area, sortedCols);
                artColor.set(sortedCols[0].hex);
            })
            .catch(console.error);
    }
</script>

<div class="artwork" style="--color:{$artColor}; --artwidth:{w}px">
    <div class="metadata">
        <div class="album">{$trackInfo.album}</div>
        <div class="grid">
            <div class="label">Date</div>
            <div class="data">{$trackInfo.date}</div>

            {#if $trackInfo.labels}
                <div class="label">Label</div>
                <div class="data">{$trackInfo.labels}</div>
            {/if}

            {#if $trackInfo.genre}
                <div class="label">Genre</div>
                <div class="data">{$trackInfo.genre}</div>
            {/if}

            {#if $trackInfo.playcount > 0}
                <div class="label">Playcount</div>
                <div class="data">{$trackInfo.playcount}</div>
            {/if}

            {#if $trackInfo.rating > 0}
                <div class="label">Rating</div>
                <div class="data rating">
                    {#each { length: $trackInfo.rating } as _}
                        <span class="material-symbols-outlined"> grade </span>
                    {/each}
                </div>
            {/if}
        </div>
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

    $left-padding: 1rem;

    .artwork {
        background-color: var(--color);
        padding-left: $left-padding;
        width: fit-content;
        display: flex;

        .metadata {
            min-width: calc(50vw - var(--artwidth) / 2 - #{$left-padding});
            max-width: calc(50vw - var(--artwidth) / 2 - #{$left-padding});
            display: inline-block;
            font-size: 2rem;
            font-weight: 300;
            padding: 1rem 1rem 1rem 0;
            box-sizing: border-box;

            .album {
                // font-family: 'Helvetica Neue LT Pro';
                font-size: 26px;
                font-weight: 500;
                margin-bottom: 2px;
            }

            .grid {
                font-size: 20px;
                max-width: 25vw;
                display: grid;
                grid-template-columns: 2fr 3fr;
                grid-auto-rows: auto;
                gap: 0.2rem 0.5rem;

                .label {
                    // width: 5vw;
                    // flex: 1 35%;
                }
                .data {
                    &.rating {
                        color: orange;
                        text-shadow: 0px 0px 1px black;
                    }
                }
            }
            // background:red;
        }

        img.albumart {
            max-width: calc(55vw);
            max-height: calc(
                100vh - $header-height - $progress-bar-time-font-size - $progress-bar-height - 150px
            );
            min-height: calc(
                100vh - $header-height - $progress-bar-time-font-size - $progress-bar-height - 150px
            );
            display: block; // fix the extra 4 pixels of parent space
        }
    }
</style>
