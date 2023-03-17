<script lang="ts">
    import { page } from '$app/stores';
    import { noop, onDestroy, onMount } from 'svelte/internal';
    import { searchString, setFocus } from '@stores/stores';
    import { librarySearch } from '@api/commands';
    import { goto } from '$app/navigation';
    import type { Unsubscriber } from 'svelte/store';

    let inputRef: HTMLElement;
    let showInput = false;
    const unsubscribe: Unsubscriber[] = [];

    unsubscribe.push(
        setFocus.subscribe(val => {
            // set the focus
            setTimeout(() => {
                inputRef?.focus();
            }, 100);
        })
    );

    const showSearch = async () => {
        if ($page.url.pathname !== '/georgia/playlist') {
            await goto('/georgia/playlist');
        }
        setFocus.update(n => n + 1);
    };

    function doSearch(evt: KeyboardEvent) {
        if ($searchString.length) {
            librarySearch($searchString);
        }
        evt.stopPropagation();
    }

    const watchPage = (page: any) => {
        const newPage = page.route.id;
        showInput = newPage === '/playlist';
    };

    onMount(() => {
        unsubscribe.push(page.subscribe(watchPage));
        if ($page.url.pathname.startsWith('/georgia/playlist')) {
        }
        // console.log('search loaded:', page);
    });

    onDestroy(() => {
        unsubscribe.forEach(u => u());
    });
</script>

<div class="playlist-search">
    <span class="material-symbols-outlined magnifier" on:click={showSearch} on:keydown={showSearch}>
        search
    </span>
    {#if showInput}
        <div class="input-box">
            <input
                type="search"
                placeholder="Search"
                bind:value={$searchString}
                on:keyup={doSearch}
                bind:this={inputRef}
            />
            <span class="underline-not-focused" />
            <span class="underline" />
        </div>
    {/if}
</div>

<style lang="scss">
    .playlist-search {
        z-index: 100; // above transport
        position: absolute;
        left: 1rem;
        top: 2rem;
        display: flex;

        .magnifier {
            font-size: 20px;
            top: 3px;
            position: relative;
            line-height: unset;
            cursor: pointer;
        }

        input {
            width: 100%;
            height: 30px;
            box-sizing: border-box;
            line-height: 30px;
            font-size: 14px;
            border: 0;
            background: none;
            outline: none;
            border-radius: 0;
            color: white;
            -webkit-appearance: none;

            &::-webkit-search-cancel-button {
                /* Remove default */
                -webkit-appearance: none;
                background-color: var(--primary);
                height: 20px;
                width: 20px;
                -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
                background-size: 20px 20px;
                left: 2px;
                position: relative;
            }

            &:focus {
                & ~ .underline {
                    width: 100%;
                }
                & ~ .underline-not-focused {
                    visibility: hidden;
                }
            }
        }
        .underline {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: all 200ms ease-out;
        }
        .underline-not-focused {
            display: block;
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            border-bottom: 1px solid #ccc;
        }
    }
</style>
