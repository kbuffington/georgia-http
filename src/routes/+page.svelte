<script>
    import Artwork from './Artwork.svelte';
    import { fb, playingInfo, trackInfo }  from '@stores/fb-store';
</script>

<div id="main-content">
    <div class="top-content">
        {#await playingInfo.load()}
            Loading...
        {:then}
            {#if !$fb.isStopped}
                <div class="artist">{ $trackInfo.artist }</div>
                <Artwork />
            {/if}
        {/await}
    </div>
</div>

<style lang="scss">
    @import "@css/colors.scss";

    #main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        z-index: 1000;

        .top-content {
            flex-grow: 1;

            .artist {
                padding: 0 1rem;
                font-size: 38px;
                font-weight: 500;
            }
        }
    }
</style>