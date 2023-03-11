<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte/internal';

    onMount(() => {
        // console.log('search loaded:', page);
    });
</script>

<div class="playlist-search">
    <span class="material-symbols-outlined"> search </span>
    <div class="input-box">
        <input type="search" placeholder="Search" />
        <span class="underline-not-focused" />
        <span class="underline" />
    </div>
</div>

<style lang="scss">
    .playlist-search {
        z-index: 100; // above transport
        position: absolute;
        left: 1rem;
        top: 2rem;
        display: flex;

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
            -webkit-appearance: none;

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
