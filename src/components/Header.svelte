<script lang="ts">
    import Fab from '@smui/fab';
    import { playOrPause, startNext, startPrevious, stop } from '@api/commands';
    import { fb, playingInfo } from '@stores/fb-store';
    import { progressUseTransition, progressVal, userSettings } from '@stores/stores';
    import { refreshPlayingInfo } from '@api/backend';
    import RoutingTabs from './RoutingTabs.svelte';
    import Search from './Search.svelte';

    function reloadData() {
        refreshPlayingInfo();
    }

    function handleTransportClick(type: string) {
        const cb = () => {
            progressUseTransition.set(true);
        };

        progressUseTransition.set(false);
        progressVal.updateTime(0);
        switch (type) {
            case 'stop':
                stop(cb);
                break;
            case 'prev':
                startPrevious(cb);
                break;
            case 'next':
                startNext(cb);
                break;
        }
    }
</script>

<header>
    <RoutingTabs />
    <Search />

    <ul id="transport">
        <li>
            <Fab on:click={() => handleTransportClick('stop')} mini>
                <span class="material-symbols-outlined"> stop </span>
            </Fab>
        </li>
        <li>
            <Fab on:click={() => handleTransportClick('prev')} mini>
                <span class="material-symbols-outlined"> skip_previous </span>
            </Fab>
        </li>
        <li>
            <Fab on:click={playOrPause} mini>
                {#await playingInfo.load()}
                    <span class="material-symbols-outlined"> play_arrow </span>
                {:then}
                    {#if !$fb.isPlaying}
                        <span class="material-symbols-outlined"> play_arrow </span>
                    {:else}
                        <span class="material-symbols-outlined"> pause </span>
                    {/if}
                {/await}
            </Fab>
        </li>
        <li>
            <Fab on:click={() => handleTransportClick('next')} mini>
                <span class="material-symbols-outlined"> skip_next </span>
            </Fab>
        </li>
    </ul>

    <!-- <div class="switch-wrapper">
        <Switch
            class="switch"
            bind:checked={$userSettings.useMocks}
            on:change={reloadData}
            label="Mocked data"
            size="md"
        />
    </div> -->
</header>

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    $padding: 1rem;

    header {
        background-color: $header-bg;
        height: $header-height; // no padding on top or bottom
        padding: 0 $padding;

        #transport {
            position: absolute;
            top: 2rem;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            padding: 0;
            display: inline-block;
            text-align: center;
            z-index: 1001; // above #main-content

            list-style: none;

            li {
                display: inline-block;
                position: relative;
                height: 100%;
            }
        }

        // .switch-wrapper {
        //     position: absolute;
        //     right: 20px;
        //     top: 20px;
        //     font-family: sans-serif;
        //     z-index: 100;
        // }
    }
</style>
