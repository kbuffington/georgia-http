<script>
    import { playingInfo } from '@stores/fb-store';
import Header from './Header.svelte';
    import Progress from './Progress.svelte';
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <!-- Material Icons -->
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,100;1,300&display=swap" rel="stylesheet">
    <!-- Roboto Mono -->
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto+Mono"
    />

    <!-- SMUI Styles -->
    <link rel="stylesheet" href="/georgia/smui.css" media="(prefers-color-scheme: light)" />
    <link rel="stylesheet" href="/georgia/smui-dark.css" media="screen and (prefers-color-scheme: dark)"
    />
</svelte:head>

<div class="app">
    <Header />

    <main>
        <div class="menu-bg-extended" />
        <slot />
    </main>

    <footer>
        {#await playingInfo.load()}
            <span></span>
        {:then}
            <Progress />
        {/await}
        <p class="version-string">Georgia-HTTP</p>
    </footer>
</div>

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: $bg-color;
        font-family: 'Roboto';
        color: white;

        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            // padding: 1rem;
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
            width: 100%;
            // display: flex;
            // flex-direction: column;
            // justify-content: center;
            // align-items: center;
            font-size: 12px;
            padding: 0;

            .version-string {
                text-align: center;
            }
        }
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }

    :global(.material-symbols-outlined) {
        // material symbols outlined
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
    }
</style>
