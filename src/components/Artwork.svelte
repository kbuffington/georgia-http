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

                {#if $trackInfo.labels.length}
                    <div class="label">Label</div>
                    <div class="data">
                        {#each $trackInfo.labels as label, i}
                            {#if i > 0}
                                <div class="dot noto-symbol">⋅</div>
                            {/if}
                            {label}
                        {/each}
                    </div>
                {/if}

                {#if $trackInfo.genre.length}
                    <div class="label">Genre</div>
                    <div class="data">
                        {#each $trackInfo.genre as genre, i}
                            {#if i > 0}
                                <div class="dot noto-symbol">⋅</div>
                            {/if}
                            {genre}
                        {/each}
                    </div>
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
            {#if $trackInfo.discart}
                <div class="discart-container">
                    <img class="discart" src={$trackInfo.discart} alt="disc art" />
                </div>
            {/if}
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
    $art-top: calc($header-height + $artist-name-height);

    // the -7.5rem is readding in what was the absolute positioning of the artwork + giving some space between elements
    $art-height: calc(100vh - $art-top - $total-progress-height - 1.5rem);

    .artwork {
        background-color: var(--primary);
        color: var(--textColor);
        padding-left: $left-padding;
        width: fit-content;
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        transition-property: left, min-width, max-width;
        transition-duration: 1s;

        &.off {
            left: calc(0px - #{$max-artwidth});
            .art-wrapper {
                left: calc(0px - #{$max-artwidth});
            }
        }

        &.left {
            $art-left: calc(0.75rem + (50vw - 0.75rem) / 2 - (var(--artwidth) / 2));

            .art-wrapper {
                left: $art-left;

                img.albumart {
                    cursor: pointer;
                    max-width: calc(50vw - 0.75rem);
                }

                .discart-container {
                    left: calc($art-left * -2);
                }
            }
            .metadata {
                min-width: $art-left;
                max-width: $art-left;
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

                    .dot {
                        font-weight: 100;
                        font-size: 40px;
                        line-height: 19px;
                        display: inline-block;
                        position: relative;
                        top: 7px;
                        padding-left: 0.35rem;
                    }
                }
            }
        }

        .art-wrapper {
            position: absolute;
            left: calc(50vw - var(--artwidth) / 2);
            transition: left 1s;
            border-left: 1px solid rgba(0, 0, 0, 0.2);
        }

        .discart-container {
            position: absolute;
            z-index: -1;
            transition: left 1.5s;
            left: min(
                var(--artwidth) * 0.47,
                calc(100vw - (50vw - var(--artwidth) / 2)) - $art-height - 10px
            );
            overflow: hidden; // prevent bouncy scrollbar
        }

        img.albumart,
        img.discart {
            max-width: $max-artwidth;
            max-height: $art-height;
            min-height: $art-height;
            display: block; // fix the extra 4 pixels of parent space
        }

        img.discart {
            max-width: $art-height; // needs to be square
            animation: rotation 3s infinite linear;
        }
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
</style>
