<script>

</script>

<header>
    <a href="/playlist"><button>Playlist</button></a>
    <a href="/"><button>Search</button></a>
    <a href="/"><button>Now Playing</button></a>
</header>

<style lang="scss">
    @import "../scss/colors.scss";
    @import "../scss/constants.scss";

    $padding: 1rem;

    header {
        background-color: $menu-bg;
        height: calc($header-height - 2 * $padding);
        padding: $padding;
    }
</style>