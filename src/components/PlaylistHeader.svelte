<script lang="ts">
    import { playlistData, playlistsInfo } from '@stores/fb-store';
    import { setPlaylistPage, switchPlaylist } from '@api/commands';
    import { onDestroy } from 'svelte';
    import Button from '@smui/button';
    import Menu from '@smui/menu';
    import Slider from '@components/Slider.svelte';
    import List, { Item, Text, Meta } from '@smui/list';

    let menu: Menu;
    let currentPage = 1;

    const unsubscribe = playlistData.subscribe(data => {
        currentPage = data?.page ?? 1;
    });

    function updatePage() {
        setPlaylistPage(currentPage);
    }

    function switchToPlaylist(plIndex: number) {
        if ($playlistsInfo.playlistActive !== plIndex) {
            switchPlaylist(plIndex);
        }
    }

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="active-playlist">
    <div class="playlist-title">
        {#if $playlistsInfo.playlists.length}
            {$playlistsInfo.playlists[$playlistsInfo.playlistActive].name}
            {#if $playlistsInfo.playlists[$playlistsInfo.playlistActive].locked}
                <span class="lock-icon material-symbols-outlined"> lock </span>
            {/if}
        {/if}
    </div>
    <div class="menu-container">
        <Button
            class="mini"
            on:click={() => {
                menu.setOpen(true);
            }}
        >
            <span class="material-symbols-outlined"> arrow_drop_down </span>
        </Button>
        <Menu bind:this={menu} anchorCorner="TOP_START" class="playlist-menu">
            <List>
                {#each $playlistsInfo.playlists as pl, i}
                    <Item on:SMUI:action={() => switchToPlaylist(i)}>
                        <div class="playlist-item">
                            <Text>
                                {pl.name}
                                {#if pl.locked}
                                    <span class="lock-icon material-symbols-outlined"> lock </span>
                                {/if}
                            </Text>
                            <Meta>[{pl.count}]</Meta>
                        </div>
                        <!-- <Text>
                            <PrimaryText>{pl.name}</PrimaryText>
                        </Text> -->
                    </Item>
                {/each}
            </List>
        </Menu>
    </div>
</div>

<div class="page-selection">
    <!-- .pages can be 0 if the playlist is empty -->
    {#if $playlistData.pages <= 1}
        <div class="page-num">-</div>
        <div class="slider-container">
            <Slider value={1} min={1} max={2} disabled />
        </div>
        <div class="page-num">-</div>
    {:else}
        <div class="page-num">1</div>
        <div class="slider-container">
            <Slider
                bind:value={currentPage}
                on:change={updatePage}
                min={1}
                max={$playlistData.pages}
            />
        </div>
        <div class="page-num">{$playlistData.pages}</div>
    {/if}
</div>

<style lang="scss">
    @import '@css/constants.scss';
    @import '@css/colors.scss';

    .page-selection {
        // width: 100%;
        display: flex;

        .slider-container {
            // flex-grow: 1;
        }
        .page-num {
            font-size: 13px;
            width: 1.75rem;
            top: 10px;
            position: relative;
            text-align: right;
            padding-right: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
        }
        .slider-container {
            flex-grow: 1;
            margin-top: 7px;
            margin-bottom: 5px;
        }
        div:first-of-type {
            width: 1.25rem;
            padding: 0;
            // text-align: right;
        }
    }
    .page-selection :global(.page-slider) {
        // flex-grow: 1;
        width: calc(100% - 4rem);
        // height: $pl-slider-height !important;
    }
    .page-selection :global(.mdc-slider .mdc-slider__thumb) {
        // height: $pl-slider-height !important;
        // width: $pl-slider-height !important;
        // left: calc($pl-slider-height / -2) !important;
    }

    .menu-container :global(.mdc-button.mini) {
        height: $pl-header-height !important;
        padding: 0px !important;
        min-width: 48px !important;
    }
    .menu-container :global(.playlist-menu.mdc-menu) {
        transform-origin: right top !important;
        left: unset !important;
        right: 0px;
        max-height: 72vh !important;
        overflow-y: auto;
    }

    .active-playlist {
        display: flex;

        .playlist-title {
            flex-grow: 1;
            border-right: 1px dotted $dim-text;
            margin-right: 0.25rem;

            .lock-icon {
                width: 20px;
                font-size: 14px;
                line-height: unset;
                color: $dim-text;
            }
        }

        .playlist-item {
            min-width: 30vw;
            max-width: 30vw;
            display: flex;

            .lock-icon {
                width: 20px;
                font-size: 14px;
                line-height: unset;
                color: $dim-text;
            }
        }
    }

    .active-playlist :global(.playlist-item .mdc-deprecated-list-item__text) {
        flex-grow: 1 !important;
        text-align: left !important;
        padding-right: 1rem;
    }
    // .active-playlist :global(.playlist-item .mdc-deprecated-list-item__secondary-text) {
    //     text-align: right !important;
    // }
</style>
