<script>
	import Header from './Header.svelte';
</script>

<div class="app">
    <Header />

    <main>
        <div class="menu-bg-extended"></div>
        <slot />
    </main>

    <footer>
        <p>Georgia-HTTP</p>
    </footer>
</div>

<style lang="scss">
    @import "../scss/colors.scss";
    @import "../scss/constants.scss";

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: $bg-color;
        font-family: 'Helvetica Neue LT Pro';
        color: white;

        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;

            .menu-bg-extended {
                position: absolute;
                top: $header-height;
                left: 0px;
                background: $menu-bg;
                width: 100%;
                height: $extended-header-bg-height;
                z-index: 0;
            }
        }

        footer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            padding: 0;

            a {
                font-weight: bold;
            }
        }
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>