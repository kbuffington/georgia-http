<script lang="ts">
    import { trackInfo } from '@stores/fb-store';

    export let rightInfoHidden = true;
</script>

<div class="artist-container">
    <div class="artist">
        {$trackInfo.artist}
    </div>
    {#each $trackInfo.artistCountryFlags as flag}
        <img class="artist-flag" src="/georgia/images/flags/64/{flag}.png" alt="{flag} flag" />
    {/each}
</div>
<div class="right-info" class:hidden={rightInfoHidden}>
    <div class="year">{$trackInfo.year}</div>
    <div class="codec">{$trackInfo.codecInfo}</div>
</div>

<style lang="scss">
    @import '@css/constants.scss';

    .artist-container {
        position: relative;
        top: -1rem;

        .artist {
            display: inline-block;
            padding: 0 0.5rem 0.5rem 1rem;
            font-size: 38px;
            font-weight: 500;
        }

        .artist-flag {
            display: inline-block;
            height: 34px;
            vertical-align: text-bottom;
            padding-right: 0.25rem;
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
