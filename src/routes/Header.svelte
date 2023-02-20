<script lang="ts">
    import { Switch } from '@svelteuidev/core';
    import Fab from '@smui/fab';
    import { playOrPause, startNext, startPrevious, stop } from '../stores/commands';
    import { fb, playingInfo } from '../stores/fb-store';
    import { userSettings } from '../stores/stores';

    function reloadData() {
        // setTimeout(playingInfo.reload!, 100);
    }
</script>

<header>
    <a href="/georgia/playlist"><button>Playlists</button></a>
    <a href="/georgia"><button>Search</button></a>
    <a href="/georgia"><button>Now Playing</button></a>

    <ul id="transport">
        <li>
            <Fab on:click={stop} mini>
                <span class="material-symbols-outlined"> stop </span>
            </Fab>
        </li>
        <li>
            <Fab on:click={startPrevious} mini>
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
            <Fab on:click={startNext} mini>
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

        #transport {
            position: absolute;
            top: 0px;
            left: 0;
            right: 0;
            width: 200px;
            margin-left: auto;
            margin-right: auto;

            justify-content: center;
            align-items: center;
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
        }
    }
</style>
