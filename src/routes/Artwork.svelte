<script lang="ts">
    import { trackInfo } from '@stores/fb-store';
    import { artColor } from '@stores/stores';
    import { theme } from '@stores/art-store';
    import { extractOptions } from '@api/artwork';

    let w: number;

    function imageLoaded() {
        theme.getArtColors($trackInfo.artwork);
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

            {#if $trackInfo.added}
                <div class="label">Added</div>
                <div class="data">{$trackInfo.added}</div>
            {/if}

            {#if $trackInfo.lastPlayed}
                <div class="label">Last Played</div>
                <div class="data">{$trackInfo.lastPlayed}</div>
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
                font-size: 26px;
                font-weight: 500;
                margin-bottom: 2px;
            }

            .grid {
                font-size: 20px;
                display: grid;
                grid-template-columns: fit-content(6vw) auto;
                grid-auto-rows: auto;
                gap: 0.3rem 1rem;

                .label {
                    max-width: 7.5rem;
                    min-width: 6.5rem;
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
