<script lang="ts">
    import { pausedState, trackInfo } from '@stores/fb-store';
    import { theme } from '@stores/art-store';
    import Timeline from '@components/Timeline.svelte';
    import PauseButton from '@components/PauseButton.svelte';
    import { playOrPause, setPlayingRating } from '@api/commands';

    interface Props {
        position?: string;
    }

    let { position = 'center' }: Props = $props();

    // Leave the width unset until it's measured: --artwidth must stay unset on first render so the
    // calc()-based `left` falls back to auto, which doesn't transition. Starting at 0 would make the
    // art slide in from the right on every load.
    let w = $state<number>();
    const artWidthStyle = $derived(w === undefined ? '' : `--artwidth:${w}px`);

    function imageLoaded(img: HTMLImageElement) {
        theme.getArtColors(img);
    }

    // star the pointer is over (1-5), used to preview the rating a double-click would set
    let hoverRating = $state(0);
    const shownRating = $derived(hoverRating || $trackInfo.rating);

    /** Double-clicking a star sets that rating; double-clicking the current rating clears it. */
    function ratePlaying(rating: number) {
        setPlayingRating(rating === $trackInfo.rating ? 0 : rating);
    }
</script>

<div
    class:off={position === 'off'}
    class:left={position === 'left'}
    class:center={position === 'center'}
    class="artwork"
    style={artWidthStyle}
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
                        {#each $trackInfo.labels as label, i (i)}
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
                        {#each $trackInfo.genre as genre, i (i)}
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

                <div class="label">Rating</div>
                <div class="data rating" onmouseleave={() => (hoverRating = 0)} role="group">
                    {#each { length: 5 } as _, i (i)}
                        <span
                            class="material-symbols-outlined star"
                            class:filled={i < shownRating}
                            class:previewing={hoverRating > 0}
                            role="button"
                            tabindex="-1"
                            title={i + 1 === $trackInfo.rating
                                ? 'Double-click to clear rating'
                                : `Double-click to rate ${i + 1}`}
                            onmouseenter={() => (hoverRating = i + 1)}
                            ondblclick={() => ratePlaying(i + 1)}
                        >
                            grade
                        </span>
                    {/each}
                </div>
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
                onclick={playOrPause}
                onkeydown={() => {}}
                onload={evt => {
                    imageLoaded(evt.currentTarget as HTMLImageElement);
                }}
            />
            {#if $pausedState}
                <PauseButton size={Math.max(100, (w ?? 0) / 4)} />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    @use '@css/constants.scss' as *;

    $left-padding: 1rem;
    $max-artwidth: 55vw;

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
                    left: calc($art-left * -2.5);
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
                        user-select: none; // double-clicking to rate shouldn't select text
                        width: fit-content;

                        .star {
                            cursor: pointer;
                            // unfilled stars are outlines
                            font-variation-settings:
                                'FILL' 0,
                                'wght' 400,
                                'GRAD' 0,
                                'opsz' 48;
                            opacity: 0.6;

                            &.filled {
                                font-variation-settings:
                                    'FILL' 1,
                                    'wght' 400,
                                    'GRAD' 0,
                                    'opsz' 48;
                                opacity: 1;
                            }
                            // while hovering, show the rating a double-click would set
                            &.previewing.filled {
                                color: #ffc04d;
                            }
                        }
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
