<script lang="ts">
    import { trackInfo } from '@stores/fb-store';

    export let rightInfoHidden = true;
</script>

<div class="artist-container">
    <div class="artist-wrapper">
        <div class="artist">
            {$trackInfo.artist}
        </div>
        {#each $trackInfo.artistCountryFlags as flag}
            <img class="artist-flag" src="/georgia/images/flags/64/{flag}.png" alt="{flag} flag" />
        {/each}
    </div>
</div>
<div class="right-info" class:hidden={rightInfoHidden}>
    <div class="year">{$trackInfo.year}</div>
    <div class="codec">{$trackInfo.codecInfo}</div>
</div>

<style lang="scss">
    @import '@css/constants.scss';

    $artist-wrapper-max-width: calc(100vw - 12rem);

    .artist-container {
        position: relative;
        top: -1rem;
        min-height: $artist-name-height;
        max-height: $artist-name-height;
        // move artist info to bottom
        display: flex;
        justify-content: flex-end;
        flex-direction: column;

        .artist-wrapper {
            min-height: 53px;
            max-height: 53px;
            white-space: nowrap;
            max-width: $artist-wrapper-max-width;
            overflow: hidden;

            .artist {
                display: inline-block;
                padding: 0 0.5rem 0.5rem 1rem;
                font-size: 38px;
                font-weight: 500;
                max-width: calc($artist-wrapper-max-width - 4rem);
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .artist-flag {
                display: inline-block;
                height: 34px;
                vertical-align: text-bottom;
                padding-right: 0.25rem;
                position: relative;
                top: -1rem;
            }
        }
    }

    .right-info {
        position: absolute;
        right: 1rem;
        top: calc($header-height + 0.5rem);
        transition: right 1s;

        .year {
            font-size: 42px;
            font-weight: 700;
            text-align: right;
            margin-bottom: 0.25rem;
        }

        .codec {
            font-weight: 100;
        }

        &.hidden {
            right: calc(0px - 25rem);
        }
    }
</style>
