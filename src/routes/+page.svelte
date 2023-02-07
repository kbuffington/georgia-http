<script>
    import Progress from './Progress.svelte';
    import Artwork from './Artwork.svelte';
    import { fbStore, playingInfo }  from '../stores/fb-store';

    fbStore.init();
</script>

<div id="main-content">
    <div class="top-content">
        {#await playingInfo.load()}
            Loading...
        {:then}
            <div class="artist">{ $playingInfo.helper1 }</div>
            <Artwork />
        {/await}
    </div>
    <Progress />
</div>

<style lang="scss">
    @import "../scss/colors.scss";

    #main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        z-index: 1000;

        .top-content {
            flex-grow: 1;

            .artist {
                font-size: 38px;
                font-weight: 500;
            }
        }
    }
</style>