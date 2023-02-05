<script>

</script>

<header>
    Header block
</header>

<style lang="scss">
    @import "../scss/colors.scss";
    $padding: 1rem;
    $height: 100px; // guaranteed to be this height regardless of padding

    header {
        background-color: $menu-bg;
        height: calc($height - 2 * $padding);
        padding: $padding;
    }
</style>