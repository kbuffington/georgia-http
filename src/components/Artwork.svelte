<script lang="ts">
    import { fb, trackInfo } from '@stores/fb-store';
    import { theme } from '@stores/art-store';
    import Timeline from '@components/Timeline.svelte';
    import PauseButton from '@components/PauseButton.svelte';
    import { playOrPause } from '@api/commands';

    export let position = 'center';

    let w: number;

    function imageLoaded() {
        theme.getArtColors($trackInfo.artwork);
    }
</script>

<div
    class:off={position === 'off'}
    class:left={position === 'left'}
    class:center={position === 'center'}
    class="artwork"
    style="--artwidth:{w}px"
>
    <div class="metadata">
        {#if position !== 'left'}
            <div class="album">{$trackInfo.album}</div>
            <Timeline />
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
        {/if}
    </div>
    <div class="art-wrapper">
        <div class="art-measure" bind:clientWidth={w}>
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
                <PauseButton size={Math.max(100, w / 4)} />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @import '@css/constants.scss';

    $left-padding: 1rem;
    $max-artwidth: 55vw;
    $art-top: 7rem;

    $art-height: calc(100vh - $art-top - $total-progress-height - 2rem);

    .artwork {
        background-color: var(--primary);
        color: var(--textColor);
        padding-left: $left-padding;
        width: fit-content;
        display: flex;
        position: absolute;
        left: 0;
        top: $art-top;
        transition-property: left, min-width, max-width;
        transition-duration: 1s;

        &.off {
            left: calc(0px - #{$max-artwidth});
            .art-wrapper {
                left: calc(0px - #{$max-artwidth});
            }
        }

        &.left {
            .art-wrapper {
                left: $left-padding;

                img.albumart {
                    max-width: calc(50vw - 1rem);
                }
            }
            .metadata {
                min-width: $left-padding;
                max-width: $left-padding;
            }
        }

        .metadata {
            transition: min-width 1s;
            min-width: calc(50vw - var(--artwidth) / 2 - #{$left-padding});
            max-width: calc(50vw - var(--artwidth) / 2 - #{$left-padding});
            max-height: $art-height;
            min-height: $art-height;
            display: inline-block;
            font-size: 2rem;
            font-weight: 300;
            padding: 1rem 1rem 1rem 0;
            border-right: 1px solid rgba(0, 0, 0, 0.2);
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

        .art-wrapper {
            position: absolute;
            left: calc(50vw - var(--artwidth) / 2);
            transition: left 1s;
        }

        img.albumart {
            max-width: $max-artwidth;
            max-height: $art-height;
            min-height: $art-height;
            display: block; // fix the extra 4 pixels of parent space
        }
    }
</style>
