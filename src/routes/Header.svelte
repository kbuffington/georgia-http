<script lang="ts">
    import { Switch } from '@svelteuidev/core';
    import { refreshPlayingInfo } from '../stores/backend';
    import { playingInfo } from '../stores/fb-store';
    import { userSettings } from '../stores/stores';

    function reloadData() {
        setTimeout(playingInfo.reload!, 100);
    }
</script>

<header>
    <a href="/playlist"><button>Playlist</button></a>
    <a href="/"><button>Search</button></a>
    <a href="/"><button>Now Playing</button></a>

    <ul id="transport">
        <li>
            <span class="material-symbols-outlined"> stop </span>
        </li>
        <li>
            <span class="material-symbols-outlined"> skip_previous </span>
        </li>
        <li>
            <span class="material-symbols-outlined"> play_arrow </span>
        </li>
        <li>
            <span class="material-symbols-outlined"> skip_next </span>
        </li>
        <li>
            <span class="material-symbols-outlined"> shuffle </span>
        </li>
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
    @import '../scss/colors.scss';
    @import '../scss/constants.scss';

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
