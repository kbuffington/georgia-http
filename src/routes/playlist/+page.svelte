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
                {#each $playlistData as item}
                    <div class="item-row" class:active={item.active}>
                        <div class="cell tracknum">{item.tracknumber}.</div>
                        <div class="cell title">{item.title}</div>
                        <div class="cell playcount">{item.playcount} |</div>
                        <div class="cell rating">
                            <span class="star">{item.r1}</span><span class="empty">{item.r2}</span>
                        </div>
                        <!-- <div class="cell rating">{item.ratingStars}</div> -->
                        <div class="cell length">{item.displayLength}</div>
                    </div>
                {/each}
            </div>
        {/await}
    </div>
</div>

<style lang="scss">
    @import '../../scss/constants.scss';

    $playlist-width: 60vw;

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

                .item-row {
                    padding: 2px;
                    font-size: 13px;
                    font-family: 'Helvetica Now Text';
                    display: table-row;

                    &.active {
                        background-color: var(--color) !important;
                    }

                    div.cell {
                        display: table-cell;
                        &.tracknum {
                            font-family: 'Helvetica Monospaced Pro';
                            width: $pl-track-w;
                            text-align: right;
                        }
                        &.title {
                            padding-left: 1rem;
                            width: calc(100% - $pl-track-w - $pl-playcount-w - $pl-rating-w - $pl-length-w);
                        }
                        &.playcount {
                            font-family: 'Helvetica Monospaced Pro';
                            font-size: 10px;
                            text-align: right;
                            padding-right: 5px;
                            width: $pl-playcount-w;
                        }

                        &.rating {
                            .star {
                                letter-spacing: 2px;
                            }
                            .empty {
                                font-family: 'Helvetica Now Display';
                                letter-spacing: 8px;
                                padding-left: 4px;
                            }
                            // font-family: 'Helvetica Monospaced Pro';
                            // font-family: 'Segoe UI Symbolz', monospace;
                            // font-size: 15px;
                            width: $pl-rating-w;
                        }
                        &.length {
                            width: $pl-length-w;
                            text-align: right;
                            font-family: 'Helvetica Monospaced Pro';
                            padding-right: 1rem;
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
