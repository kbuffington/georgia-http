<script lang="ts">
    import { fb, playingInfo, playlistData, trackInfo } from '@stores/fb-store';
    import { artColor, searchString } from '@stores/stores';
    import PlaylistHeader from './PlaylistHeader.svelte';
    import { librarySearch, playPlaylistItem } from '@api/commands';
    import Textfield from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
    import MiniArtwork from '../MiniArtwork.svelte';

    function doSearch() {
        if ($searchString.length) {
            librarySearch($searchString);
        }
    }

    /**
     * @param index The plIndex from the playlistData
     */
    function playItem(index: number) {
        playPlaylistItem(index);
    }
</script>

{#await playingInfo.load() then}
    {#if !$fb.isStopped}
        <MiniArtwork />
    {/if}
{/await}
<div class="main-container" style="--color:{$artColor}">
    <div class="playlist-container">
        {#await playingInfo.load()}
            Loading...
        {:then}
            <div class="playlist-header">
                <PlaylistHeader />
            </div>
            <div class="playlist-data">
                {#each $playlistData.tracks as item, i}
                    <div
                        class="item-row"
                        class:active={item.active}
                        class:focused={item.focused}
                        class:newalbum={i > 0 &&
                            (item.albumArtist !== $playlistData.tracks[i - 1].albumArtist ||
                                item.album !== $playlistData.tracks[i - 1].album)}
                        on:dblclick={() => playItem(item.plIndex)}
                    >
                        <div class="cell tracknum">{item.tracknumber}.</div>
                        <div class="cell title">
                            {#if i === 0 || item.albumArtist !== $playlistData.tracks[i - 1].albumArtist || item.album !== $playlistData.tracks[i - 1].album}
                                {item.title}
                                <span
                                    class="dimmed"
                                    title="{item.artist} / {item.date} / {item.album}"
                                >
                                    / {item.artist} / {item.date} / {item.album}</span
                                >
                            {:else}
                                {item.title}
                            {/if}
                        </div>
                        <div class="cell playcount">
                            {#if item.playcount > 0}
                                {item.playcount}
                            {/if}
                        </div>
                        <div class="cell rating">
                            <span class="dimmed">| </span>
                            <span class="star">{item.ratingStars}</span>
                            <span class="empty dimmed" class:nostars={!item.ratingStars}
                                >{item.ratingEmpty}</span
                            >
                        </div>
                        <div class="cell length">{item.displayLength}</div>
                    </div>
                {/each}
            </div>
            <div class="playlist-footer">
                <div class="item-row">
                    <div class="cell tracknum">
                        {#if $fb.isPlaying}
                            Playing
                        {:else if $fb.isPaused}
                            Paused
                        {/if}
                    </div>
                    <div class="cell title">
                        {#if !$fb.isStopped}
                            {$playlistData.playingItem + 1} of {$playlistData.numItems} tracks
                            <span class="dimmed"> &mdash; {$trackInfo.codecInfo}</span>
                        {:else}
                            {$playlistData.numItems} tracks
                        {/if}
                    </div>
                    <div class="cell length">{$playlistData.totalTime}</div>
                </div>
            </div>
        {/await}
    </div>
    <div class="search-container">
        <div class="search-string">
            <Textfield
                variant="outlined"
                bind:value={$searchString}
                on:keyup={doSearch}
                label="Search"
            >
                <Icon class="material-icons" slot="leadingIcon">search</Icon>
                <!-- <span class="material-symbols-outlined"> search </span> -->
                <!-- <HelperText slot="helper">Helper Text</HelperText> -->
            </Textfield>
        </div>
    </div>
</div>

<style lang="scss">
    @import '@css/constants.scss';
    @import '@css/colors.scss';

    .main-container {
        z-index: 100;
        margin-top: 1.5rem;

        .playlist-container {
            width: fit-content;
            background-color: $panel-bg;
            border: 1px solid black;
            padding: 3px;
            border-radius: 6px;
            height: calc($pl-row-height * 31 + $pl-slider-height + $pl-header-height + 26px);

            .playlist-header {
                width: calc($playlist-width - 8px);
                padding: 3px;
                border: 1px solid black;
                border-radius: 6px;
                font-weight: 400;
                text-align: center;
                margin-bottom: 2px;
            }

            .playlist-footer {
                border-top: 1px solid black;
                background-color: rgba(0, 0, 0, 0.15); // doubles up effect of :odd below
            }

            .playlist-data,
            .playlist-footer {
                width: $playlist-width;
                display: table;

                span.dimmed {
                    color: rgb(200, 200, 200);
                }

                .item-row {
                    font-size: 12px;
                    display: table-row;
                    max-height: $pl-row-height;
                    height: $pl-row-height;
                    line-height: calc($pl-row-height - 2px);
                    cursor: default;
                    user-select: none;
                    box-sizing: border-box;

                    &.active {
                        background-color: var(--color) !important;
                    }

                    &.focused {
                        box-shadow: inset 0px 0px 0px 1px grey;
                    }
                    &:not(.focused).newalbum .cell {
                        // border-top: 1px solid var(--color);
                        border-top: 1px solid rgb(220, 220, 220);
                    }
                    &:not(.newalbum) .cell {
                        border-top: 1px solid rgba(0, 0, 0, 0); // need an invisible border so height doesn't get screwed up
                    }

                    div.cell {
                        display: table-cell;
                        padding-top: 1px; // centers within row?
                        &.tracknum {
                            font-weight: 500;
                            width: $pl-track-w;
                            text-align: right;
                        }
                        &.title {
                            font-weight: 300;
                            padding-left: 1rem;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            max-width: calc(
                                $playlist-width - $pl-track-w - $pl-playcount-w - $pl-rating-w -
                                    $pl-length-w
                            );
                        }
                        &.playcount {
                            font-size: 10px;
                            text-align: right;
                            padding-right: 5px;
                            font-weight: 100;
                            width: $pl-playcount-w;
                        }

                        &.rating {
                            .star {
                                letter-spacing: 2px;
                            }
                            .empty {
                                letter-spacing: 6.3px;

                                &.nostars {
                                    padding-left: 3px;
                                }
                            }
                            width: $pl-rating-w;
                        }
                        &.length {
                            width: $pl-length-w;
                            text-align: right;
                            padding-right: 1rem;
                            font-weight: 500;
                        }
                    }
                    &:nth-of-type(odd) {
                        background-color: rgba(0, 0, 0, 0.15);
                    }
                }
            }
        }

        .search-container {
            position: absolute;
            right: 1rem;
            top: 20vh;
            background-color: $panel-bg;
            padding: 1rem;
            border: 1px solid black;
            border-radius: 6px;
        }
    }
</style>
