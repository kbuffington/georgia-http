<script>
    import { fb, playingInfo, trackInfo } from '@stores/fb-store';
    import Artwork from '@components/Artwork.svelte';
</script>

<div id="main-content">
    <div class="top-content">
        {#await playingInfo.load()}
            Loading...
        {:then}
            {#if !$fb.isStopped}
                <div class="artist">{$trackInfo.artist}</div>
                <div class="right-info">
                    <div class="year">{$trackInfo.year}</div>
                    <div class="codec">{$trackInfo.codecInfo}</div>
                </div>
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

            .artist {
                padding: 0 1rem 0.5rem;
                font-size: 38px;
                font-weight: 500;
            }

            .right-info {
                position: absolute;
                right: 1rem;
                top: calc($header-height + 0.5rem);

                .year {
                    font-size: 42px;
                    font-weight: 700;
                    text-align: right;
                    margin-bottom: 0.25rem;
                }

                .codec {
                    font-weight: 100;
                }
            }
        }
    }
</style>
