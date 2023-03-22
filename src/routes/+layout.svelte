<script>
    import { playingInfo } from '@stores/fb-store';
    import Header from '@components/Header.svelte';
    import Progress from '@components/Progress.svelte';
    import { visibilityChange } from 'svelte-visibility-change';
    import { visibilityChanged } from '@api/refresh-data';
    import { theme } from '@stores/art-store';
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <!-- Material Icons -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <!-- Roboto Mono -->
    <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" /> -->

    <!-- SMUI Styles -->
    <link rel="stylesheet" href="/georgia/smui.css" media="(prefers-color-scheme: light)" />
    <link
        rel="stylesheet"
        href="/georgia/smui-dark.css"
        media="screen and (prefers-color-scheme: dark)"
    />
</svelte:head>

<div
    class="app"
    use:visibilityChange
    on:visibilitychange={({ detail }) => {
        visibilityChanged(detail.visible);
    }}
    style="--primary:{$theme.color};
           --accent:{$theme.accent};
           --darkAccent:{$theme.darkAccent};
           --lightAccent:{$theme.lightAccent};
           --textColor:{$theme.textColor};
           --dimTextColor:{$theme.dimTextColor};"
>
    <Header />

    <main>
        <div class="menu-bg-extended" />
        <slot />
    </main>

    <footer>
        {#await playingInfo.load()}
            <span />
        {:then}
            <Progress />
        {/await}
        <!-- <p class="version-string">Georgia-HTTP</p> -->
    </footer>
</div>

<style lang="scss">
    @import '@css/roboto/roboto.scss';
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: $bg-color;
        font-family: 'Roboto';
        color: white;
        // these are needed for preventing elements scrolled off page from being visible
        // TODO: remove similar from page.svelte?
        position: relative;
        max-width: 100%;
        overflow-x: hidden;

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
                background: $header-bg;
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

            // .version-string {
            //     text-align: center;
            // }
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
