<script lang="ts">
    import MiniArtwork from '@components/MiniArtwork.svelte';
    import Playlist from '@components/Playlist.svelte';
    import { fb, playingInfo } from '@stores/fb-store';
</script>

{#await playingInfo.load() then}
    {#if !$fb.isStopped}
        <MiniArtwork />
    {/if}
{/await}
<div class="main-container">
    <Playlist position="right" />
</div>

<style lang="scss">
    @import '@css/constants.scss';

    .main-container {
        z-index: 100;
        margin-top: 1.5rem;
    }
</style>
