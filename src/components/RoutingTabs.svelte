<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { noop, onDestroy, onMount } from 'svelte/internal';
    import type { Unsubscriber } from 'svelte/store';

    let currentPage = '/';

    const routes = [
        {
            label: 'Now Playing',
            link: '/georgia',
            id: '/',
        },
        {
            label: 'Playlist',
            link: '/georgia/playlist',
            id: '/playlist',
        },
    ];

    let selectedRoute = routes[0].link;
    let unsubscribe: Unsubscriber;

    function goToRoute(path: string, replaceState: boolean) {
        goto(path, { replaceState });
    }

    const watchPage = (page: any) => {
        const newPage = page.route.id;
        if (newPage !== currentPage) {
            const routeLink = routes.find(r => r.id === newPage)?.link;
            if (routeLink) {
                selectedRoute = routeLink;
            }
            currentPage = newPage;
        }
    };

    onMount(() => {
        const pathname = $page.url.pathname;
        const split = pathname.split('/');
        if (split[split.length - 1].includes('.html')) {
            split.pop();
        }
        const path = split.join('/');
        routes.forEach(r => {
            if (r.link === path) {
                selectedRoute = path;
            }
        });
        goToRoute(selectedRoute, true);
        unsubscribe = page.subscribe(watchPage);
    });

    onDestroy(() => {
        unsubscribe && unsubscribe();
    });
</script>

<div class="tab-wrap" style="--num-of-tabs:{routes.length};">
    {#each routes as tabRoute, i}
        <input
            type="radio"
            name="tabs"
            id="tab{i}"
            bind:group={selectedRoute}
            value={tabRoute.link}
        />
        <div
            class="tab-label-content"
            id="tab{i}-content"
            on:keydown={noop}
            on:click={() => {
                goToRoute(tabRoute.link, false);
            }}
        >
            <label for="tab{i}">{tabRoute.label}</label>
        </div>
    {/each}

    <div class="slide" />
</div>

<style lang="scss">
    @import '@css/colors';

    $num-of-tabs: 2;

    @mixin tabs {
        // @for $i from 1 through var(--num-of-tabs) {
        @for $i from 1 through $num-of-tabs {
            &:nth-of-type(#{$i}) {
                &:checked {
                    ~ .slide {
                        // left: calc((100% / #{var(--num-of-tabs)}) * #{$i - 1});
                        left: calc((100% / #{$num-of-tabs}) * #{$i - 1});
                    }
                }
            }
        }
    }

    .tab-wrap {
        margin: auto;
        position: relative;
        display: flex;
        top: 0px;
        width: 250px;
        z-index: 100;
    }

    input[type='radio'][name='tabs'] {
        position: absolute;
        z-index: -1;
        &:checked {
            + .tab-label-content {
                label {
                    color: white;
                }
                // .tab-content {
                //     display: block;
                // }
            }
        }
        @include tabs;
        &:first-of-type {
            &:checked {
                ~ .slide {
                    left: 0;
                }
            }
        }
    }

    label {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.8);
        background-color: $header-bg; // can't be transparent because the radio button is visible
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 2rem;
        transition: color 0.2s ease;
        width: 100%;
    }

    .slide {
        background: var(--primary);
        width: calc(100% / #{$num-of-tabs});
        height: 4px;
        position: absolute;
        left: 0;
        top: calc(100% - 4px);
        transition: left 0.3s ease-out;
    }

    .tab-label-content {
        width: 100%;
        // .tab-content {
        //     position: absolute;
        //     top: 100px;
        //     left: 16px;
        //     line-height: 130%;
        //     display: none;
        // }
    }

    @media screen and (max-width: 800px) {
        .tab-wrap {
            width: 80%;
            margin-left: 10%;
            top: -106px;
        }
    }
</style>
