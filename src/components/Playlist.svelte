<script lang="ts">
    import { theme } from '@stores/art-store';
    import { fb, playingInfo, playlistData, playlistsInfo, trackInfo } from '@stores/fb-store';
    import type { PlTrackData } from '@stores/types';
    import { searchString } from '@stores/stores';
    import PlaylistHeader from '@components/PlaylistHeader.svelte';
    import { flip } from 'svelte/animate';
    import {
        deleteItems,
        dequeueItems,
        librarySearch,
        moveItems,
        playPlaylistItem,
        queueItems,
        setFocus,
        setPlaylistItemsPerPage,
    } from '@api/commands';
    // import { send, receive } from '@api/crossfade';

    export let position: string;

    let selection: number[] = [];
    let anchor: number = -1;
    let focus = -1;
    let hovering: number | null = null;

    const forceUpdate = async (_: any) => {};
    let doRerender = 0;

    function doSearch(evt: CustomEvent) {
        if ($searchString.length) {
            librarySearch($searchString);
        }
        evt.stopPropagation();
    }

    /**
     * @param index The plIndex from the playlistData
     */
    function playItem(index: number) {
        playPlaylistItem(index);
    }

    function selectItem(evt: MouseEvent | KeyboardEvent, index: number, item: PlTrackData) {
        focus = index;
        // console.log(evt);
        if (evt.ctrlKey) {
            const found = selection.indexOf(item.plIndex);
            if (found === -1) {
                item = Object.assign(item, { selected: true });
                selection.push(item.plIndex);
            } else {
                item = Object.assign(item, { selected: false });
                selection.splice(found, 1); // remove
            }
            anchor = index;
        } else if (evt.shiftKey && anchor !== -1) {
            const start = Math.min(anchor, index);
            const end = Math.max(anchor, index);

            selection = $playlistData.tracks
                .filter((_, index) => index >= start && index <= end)
                .map(item => item.plIndex);
        } else {
            selection = [item.plIndex];
            anchor = index;
        }
        // console.log(anchor, selection);
    }

    function rightClickContextMenu(evt: MouseEvent, index: number, item: PlTrackData) {
        if (evt.ctrlKey && evt.buttons === 1) {
            selectItem(evt, index, item);
            doRerender++;
        } else {
            // show context menu?
            console.log(evt);
        }
    }

    const dragStart = (event: DragEvent, index: number, plIndex: number) => {
        event.dataTransfer!.effectAllowed = 'move';
        event.dataTransfer!.dropEffect = 'move';
        event.dataTransfer!.setData('text/plain', `${index}`);
        const target = event.target as Element;
        if (!selection.length) {
            selection = [plIndex];
        }
        setFocus(selection[selection.length - 1]);
    };

    const drop = (event: DragEvent, targetIndex: number) => {
        event.dataTransfer!.dropEffect = 'move';
        const start = parseInt(event.dataTransfer!.getData('text/plain'));
        hovering = null;
        const diff = targetIndex - start;
        if (diff !== 0) {
            moveItems(selection, diff);
            selection = [];
        }
    };

    function keyHandler(evt: KeyboardEvent) {
        switch (evt.code) {
            case 'KeyQ':
                selection.length && queueItems(selection);
                break;
            case 'KeyW':
                selection.length && dequeueItems(selection);
                break;
            case 'KeyP':
                // setPlaylistItemsPerPage(30);
                break;
            case 'Delete':
            case 'Backspace':
                // TODO: hide rows before refresh?
                selection.length && deleteItems(selection);
                focus = Math.max(0, focus + 1 - selection.length);
                selectItem(evt, focus, $playlistData.tracks[focus]);
                break;
            case 'ArrowUp':
                focus = Math.max(0, focus - 1);
                selectItem(evt, focus, $playlistData.tracks[focus]);
                break;
            case 'ArrowDown':
                focus = Math.min(
                    $playlistData.tracks.length - 1,
                    Math.min($playlistsInfo.playlistItemsPerPage - 1, focus + 1)
                );
                selectItem(evt, focus, $playlistData.tracks[focus]);
                break;
            default:
                console.log(evt);
                break;
        }
    }
</script>

<svelte:window on:keyup={keyHandler} />

<div
    class="playlist-container"
    class:left={position === 'left'}
    class:right={position === 'right'}
    style="--maxRows:{$playlistsInfo?.playlistItemsPerPage ?? 30}"
>
    {#await playingInfo.load()}
        Loading...
    {:then}
        <div class="playlist-header">
            <PlaylistHeader />
        </div>
        {#await forceUpdate(doRerender) then _}
            <div class="playlist-data">
                {#each $playlistData.tracks as item, i (item.plIndex)}
                    <div
                        class="item-row"
                        class:active={item.active}
                        class:focused={focus === i}
                        class:selected={selection.includes(item.plIndex)}
                        class:newalbum={i > 0 &&
                            (item.albumArtist !== $playlistData.tracks[i - 1].albumArtist ||
                                item.album !== $playlistData.tracks[i - 1].album)}
                        class:is-drop-target={hovering === i}
                        animate:flip
                        draggable={!$playlistData.locked}
                        on:dragstart={event => dragStart(event, i, item.plIndex)}
                        on:drop|preventDefault={event => drop(event, i)}
                        on:dragover={evt => evt.preventDefault()}
                        on:dragenter={() => (hovering = i)}
                        on:keydown
                        on:contextmenu|preventDefault={evt => rightClickContextMenu(evt, i, item)}
                        on:click={evt => selectItem(evt, i, item)}
                        on:dblclick={() => playItem(item.plIndex)}
                    >
                        <div class="cell tracknum">{item.tracknumber}.</div>
                        <div class="cell title">
                            {#if i === 0 || item.albumArtist !== $playlistData.tracks[i - 1].albumArtist || item.album !== $playlistData.tracks[i - 1].album}
                                {item.title}
                                {#if item.featured}
                                    <span class="featured">· {item.featured}</span>
                                {/if}
                                <span
                                    class="dimmed"
                                    title="{item.albumArtist} / {item.date} / {item.album}"
                                >
                                    / {item.albumArtist} / {item.date} / {item.album}</span
                                >
                            {:else}
                                {item.title}
                                {#if item.featured}
                                    <span class="featured">· {item.featured}</span>
                                {/if}
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
                            <span class="empty" class:nostars={!item.ratingStars}
                                >{item.ratingEmpty}</span
                            >
                        </div>
                        <div class="cell length">{item.displayLength}</div>
                    </div>
                {/each}
            </div>
        {/await}
        <div class="playlist-footer">
            <div class="playlist-footer-content">
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
                    <div class="cell length playlist-length">{$playlistData.totalTime}</div>
                </div>
            </div>
        </div>
    {/await}
</div>

<style lang="scss">
    @import '@css/constants.scss';
    @import '@css/colors.scss';

    .playlist-container {
        width: fit-content;
        background-color: $panel-bg;
        border: 1px solid black;
        padding: 3px;
        border-radius: 6px;
        height: calc(
            $pl-row-height * (var(--maxRows) + 1) + $pl-slider-height + $pl-header-height + 27px
        );
        display: flex;
        flex-direction: column;
        position: absolute;

        &.left {
            left: 0px;
        }

        &.right {
            right: 0px;
        }

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
            flex-grow: 1;
            display: flex;
            align-items: flex-end;
            background: none;

            .playlist-footer-content {
                border-top: 1px solid black;
                background-color: rgba(0, 0, 0, 0.15); // doubles up effect of :odd below
            }

            .playlist-length {
                width: 10rem !important;
            }
        }

        .playlist-data,
        .playlist-footer-content {
            width: $playlist-width;
            display: table;

            span.dimmed {
                color: var(--dimTextColor);
            }

            .item-row {
                color: rgb(230, 230, 230);
                font-size: 12px;
                display: table-row;
                max-height: $pl-row-height;
                height: $pl-row-height;
                line-height: calc($pl-row-height - 2px);
                cursor: default;
                user-select: none;
                box-sizing: border-box;

                &.is-drop-target {
                    background-color: var(--lightAccent) !important;
                }

                &.active {
                    background-color: var(--primary) !important;
                    color: var(--textColor);
                }

                &:not(.selected).newalbum .cell {
                    // border-top: 1px solid var(--color);
                    border-top: 1px solid rgb(220, 220, 220);
                }
                &:not(.newalbum) .cell {
                    border-top: 1px solid rgba(0, 0, 0, 0); // need an invisible border so height doesn't get screwed up
                }

                &.selected {
                    box-shadow: inset 0px 0px 0px 1px grey;

                    .cell {
                        color: white;
                    }
                    .cell.tracknum {
                        border-left: 5px solid var(--darkAccent);
                    }
                }

                div.cell {
                    display: table-cell;
                    padding-top: 1px; // centers within row?
                    &.tracknum {
                        font-weight: 500;
                        width: $pl-track-w;
                        text-align: right;
                        box-sizing: border-box;
                    }
                    &.title {
                        font-weight: 300;
                        padding-left: 0.4rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        max-width: calc(
                            $playlist-width - $pl-track-w - $pl-playcount-w - $pl-rating-w -
                                $pl-length-w
                        );

                        .featured {
                            font-weight: 400;
                        }
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
</style>
