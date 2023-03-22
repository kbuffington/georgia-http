<script>
    import { fb, playingInfo } from '@stores/fb-store';
    import Artwork from '@components/Artwork.svelte';
    import NowPlayingHeader from '@components/NowPlayingHeader.svelte';
    import { routingState } from '@stores/stores';
    // playlist components
    import MiniArtwork from '@components/MiniArtwork.svelte';
    import Playlist from '@components/Playlist.svelte';
    // query components
    import Query from '@components/Query.svelte';
</script>

{#await playingInfo.load()}
    Loading...
{:then}
    {#if !$fb.isStopped}
        <MiniArtwork hidden={$routingState === 'now-playing' || $fb.isStopped} />
        <NowPlayingHeader rightInfoHidden={$routingState !== 'now-playing'} />
    {/if}
    <div id="main-content">
        {#if !$fb.isStopped}
            <div class="top-content">
                <Artwork
                    position={$routingState === 'now-playing'
                        ? 'center'
                        : $routingState === 'playlist'
                        ? 'left'
                        : 'off'}
                />
            </div>
        {/if}
        <div class="playlist-view">
            <Playlist
                position={$routingState === 'now-playing'
                    ? 'off'
                    : $routingState === 'playlist'
                    ? 'right'
                    : 'left'}
            />
        </div>
        <Query hidden={$routingState !== 'query'} />
    </div>
{/await}

<style lang="scss">
    // @import '@css/colors.scss';
    @import '@css/constants.scss';

    #main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        z-index: 1000;
        // these are needed for preventing elements scrolled off page from being visible
        position: relative;
        top: -3rem;
        max-width: 100%;
        overflow-x: hidden;

        .top-content {
            flex-grow: 1;
        }

        .playlist-view {
            position: absolute;
            top: 2rem;
        }
    }
</style>
