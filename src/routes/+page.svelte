<script>
    import { fb, playingInfo } from '@stores/fb-store';
    import Artwork from '@components/Artwork.svelte';
    import NowPlayingHeader from '@components/NowPlayingHeader.svelte';
</script>

<div id="main-content">
    <div class="top-content">
        {#await playingInfo.load()}
            Loading...
        {:then}
            {#if !$fb.isStopped}
                <NowPlayingHeader />
                <Artwork />
            {/if}
        {/await}
    </div>
</div>

<style lang="scss">
    // @import '@css/colors.scss';
    @import '@css/constants.scss';

    #main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        z-index: 1000;

        .top-content {
            flex-grow: 1;
        }
    }
</style>
