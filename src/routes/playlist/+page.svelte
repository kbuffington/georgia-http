<script lang="ts">
    import { playingInfo, playlistData, playlistsInfo } from '../../stores/fb-store';
    import { artColor } from '../../stores/stores';
</script>

<div class="main-container" style="--color:{$artColor}">
    <div class="playlist-container">
        {#await playingInfo.load()}
            Loading...
        {:then}
            <div class="playlist-header">
                <div class="active-playlist">
                    {$playlistsInfo.playlists[$playlistsInfo.playlistActive].name}
                </div>
            </div>
            <div class="playlist-data">
                {#each $playlistData as item, i}
                    <div class="item-row" class:active={item.active}>
                        <div class="cell tracknum">{item.tracknumber}.</div>
                        <div class="cell title">
                            {#if i === 0 || item.albumArtist !== $playlistData[i - 1].albumArtist || item.album !== $playlistData[i - 1].album}
                                {item.title}
                                <span class="dimmed" title="{item.artist} / {item.date} / {item.album}">
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
                            <span class="empty dimmed">{item.ratingEmpty}</span>
                        </div>
                        <div class="cell length">{item.displayLength}</div>
                    </div>
                {/each}
            </div>
        {/await}
    </div>
</div>

<style lang="scss">
    @import '../../scss/constants.scss';

    .main-container {
        z-index: 100;
        .playlist-container {
            width: fit-content;
            background-color: rgb(40, 44, 47);
            border: 1px solid black;
            padding: 3px;
            border-radius: 6px;

            .playlist-header {
                width: calc($playlist-width - 8px);
                padding: 3px;
                border: 1px solid black;
                border-radius: 6px;
                font-weight: 400;
                text-align: center;
                margin-bottom: 2px;
                // display: table-row;
            }

            .playlist-data {
                width: $playlist-width;
                display: table;

                span.dimmed {
                    color: rgb(200, 200, 200);
                }

                .item-row {
                    font-size: 12px;
                    // font-family: 'Helvetica Now Text';
                    display: table-row;
                    height: 20px;

                    &.active {
                        background-color: var(--color) !important;
                    }

                    div.cell {
                        display: table-cell;
                        padding-top: 1px; // centers within row?
                        &.tracknum {
                            // font-family: 'Helvetica Monospaced Pro';
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
                                $playlist-width - $pl-track-w - $pl-playcount-w - $pl-rating-w - $pl-length-w
                            );
                        }
                        &.playcount {
                            // font-family: 'Helvetica Monospaced Pro';
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
                                // font-family: 'Helvetica Now Display';
                                letter-spacing: 8px;
                                padding-left: 3px;
                            }
                            // font-family: 'Helvetica Monospaced Pro';
                            // font-family: 'Segoe UI Symbolz', monospace;
                            // font-size: 15px;
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
    }
</style>
