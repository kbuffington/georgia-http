<script>
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
    }
</style>
