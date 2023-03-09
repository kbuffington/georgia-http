<script lang="ts">
    import { Switch } from '@svelteuidev/core';
    import Fab from '@smui/fab';
    import { playOrPause, startNext, startPrevious, stop } from '@api/commands';
    import { fb, playingInfo } from '@stores/fb-store';
    import { progressUseTransition, progressVal, userSettings } from '@stores/stores';
    import { refreshPlayingInfo } from '@api/backend';

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
                startNext(cb);
                break;
            case 'next':
                startPrevious(cb);
                break;
        }
    }

    // function handleStop() {
    //     stop(() => {});
    // }

    // function handleNext() {
    //     progressUseTransition.set(false);
    //     startNext(() => {
    //         progressVal.updateTime(0);
    //         progressUseTransition.set(true);
    //     });
    // }

    // function handlePrev() {
    //     progressUseTransition.set(false);
    //     startPrevious(() => {
    //         progressVal.updateTime(0);
    //         progressUseTransition.set(true);
    //     });
    // }
</script>

<header>
    <div class="routing">
        <a href="/georgia"><button>Now Playing</button></a>
        <a href="/georgia/playlist"><button>Playlists</button></a>
        <!-- <a href="/georgia"><button>Search</button></a> -->
    </div>

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
                <!-- <Icon class="material-icons">play_arrow</Icon> -->
            </Fab>
            <!-- <div class="button" on:click={playOrPause}>
                <span class="material-symbols-outlined"> play_arrow </span>
            </div> -->
        </li>
        <li>
            <Fab on:click={() => handleTransportClick('next')} mini>
                <span class="material-symbols-outlined"> skip_next </span>
            </Fab>
        </li>
        <!-- <li>
            <span class="material-symbols-outlined"> shuffle </span>
        </li> -->
    </ul>

    <div class="switch-wrapper">
        <Switch
            class="switch"
            bind:checked={$userSettings.useMocks}
            on:change={reloadData}
            label="Mocked data"
            size="md"
        />
    </div>
</header>

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    $padding: 1rem;

    header {
        background-color: $menu-bg;
        height: calc($header-height - 2 * $padding);
        padding: $padding;

        .routing {
            position: relative;
            display: inline-block;
            z-index: 100;

            button {
                cursor: pointer;
            }
        }

        #transport {
            position: absolute;
            top: 0px;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            padding: 0;
            display: inline-block;
            text-align: center;
            z-index: 99; // behind routing links

            list-style: none;

            li {
                display: inline-block;
                position: relative;
                height: 100%;
            }
        }

        .switch-wrapper {
            position: absolute;
            right: 20px;
            top: 20px;
            font-family: sans-serif;
            z-index: 100;
        }
    }
</style>
