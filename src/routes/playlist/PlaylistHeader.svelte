<script lang="ts">
    import { playlistData, playlistsInfo } from '../../stores/fb-store';
    import { setPlaylistPage, switchPlaylist } from '../../stores/commands';
    import Button from '@smui/button';
    import Menu from '@smui/menu';
    import Slider from '@smui/slider';
    import List, { Item, Text } from '@smui/list';
    import { onDestroy } from 'svelte';

    let menu: Menu;
    let currentPage = 1;

    const unsubscribe = playlistData.subscribe(data => {
        currentPage = data?.page ? data.page : 1;
        console.log(currentPage);
    });

    function updatePage() {
        setPlaylistPage(currentPage);
    }

    function switchToPlaylist(plIndex: number) {
        if (playlistsInfo.active !== plIndex) {
            switchPlaylist(plIndex);
        }
    }

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="active-playlist">
    <div class="playlist-title">
        {$playlistsInfo.playlists[$playlistsInfo.playlistActive].name}
    </div>
    <div class="menu-container">
        <Button mini on:click={() => { menu.setOpen(true); console.log(menu.isOpen(), menu); }}>
            <!-- <Icon class="material-icons" style="margin: 0;">arrow_drop_down</Icon> -->
            <span class="material-symbols-outlined"> arrow_drop_down </span>
        </Button>
        <Menu bind:this={menu} anchorCorner="TOP_START" class="playlist-menu">
            <List>
                {#each $playlistsInfo.playlists as pl, i}
                    <Item on:SMUI:action={() => switchToPlaylist(i) }>
                        <Text>{pl.name}</Text>
                    </Item>
                {/each}
            </List>
        </Menu>
    </div>
</div>

<div class="page-selection">
    {#if $playlistData.pages == 1}
        <Slider
            class="page-slider"
            bind:value={currentPage}
            min={1}
            max={2}
            disabled
            input$aria-label="Playlist page slider"
        />
    {:else}
        <Slider
            class="page-slider"
            bind:value={currentPage}
            on:click={updatePage}
            min={1}
            max={$playlistData.pages}
            discrete
            tickMarks
            input$aria-label="Playlist page slider"
        />
    {/if}
</div>

<style lang="scss">
    @import '@css/constants.scss';

    :global(.page-slider) {
        height: $pl-slider-height !important;
    }
    :global(.mdc-slider .mdc-slider__thumb) {
        height: $pl-slider-height !important;
        width: $pl-slider-height !important;
        left: calc($pl-slider-height / -2) !important;
    }

    :global(.mdc-button[mini=true]) {
        height: $pl-header-height !important;
        padding: 0px !important;
    }
    :global(.playlist-menu.mdc-menu) {
        transform-origin: right top !important;
        left: unset !important;
        right: 0px;
        max-height: 72vh !important;
        overflow-y: scroll;
    }



    .active-playlist {
        display: flex;

        .playlist-title {
            flex-grow: 1;
        }
    }
</style>