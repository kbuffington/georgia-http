<script lang="ts">
    import { playingInfo, playlistData } from '@stores/fb-store';
    import { artColor } from '@stores/stores';
    import PlaylistHeader from './PlaylistHeader.svelte';
    import { librarySearch, playPlaylistItem } from '@api/commands';
    import Textfield from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
    // import HelperText from '@smui/textfield/helper-text';

    let searchString = '';

    function doSearch() {
        console.log('searching for:', searchString);
        librarySearch(searchString);
    }

    function playItem(index: number) {
        playPlaylistItem(index);
    }
</script>

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
                        on:dblclick={() => playItem(i)}
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
        {/await}
    </div>
    <div class="search-container">
        <div class="search-string">
            <Textfield bind:value={searchString} on:keyup={doSearch} label="Search">
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
        margin-top: 2rem;

        .playlist-container {
            width: fit-content;
            background-color: $panel-bg;
            border: 1px solid black;
            padding: 3px;
            border-radius: 6px;
            height: calc($pl-row-height * 30 + $pl-slider-height + $pl-header-height + 8px);

            .playlist-header {
                width: calc($playlist-width - 8px);
                padding: 3px;
                border: 1px solid black;
                border-radius: 6px;
                font-weight: 400;
                text-align: center;
                margin-bottom: 2px;
            }

            .playlist-data {
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

                    &.active {
                        background-color: var(--color) !important;
                    }

                    &.focused {
                        box-shadow: inset 0px 0px 0px 1px grey;
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
                            // font-family: 'Helvetica Monospaced Pro';
                            padding-right: 1rem;
                            font-weight: 500;
                        }
                    }
                    &:nth-of-type(odd) {
                        background-color: rgba(0, 0, 0, 0.2);
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
