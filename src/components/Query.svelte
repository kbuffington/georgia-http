<script lang="ts">
    import { refreshPlayingInfo } from '@api/backend';
    import { queryAdvance, queryRetrace } from '@api/commands';
    import { rebouncedInfoPlayingRefresh } from '@api/refresh-data';
    import { playingInfo } from '@stores/fb-store';
    import type { QueryResponse } from '@stores/types';
    import { onMount } from 'svelte';
    import { noop } from 'svelte/internal';

    let queryResults: QueryResponse = { queryInfo: [], query: [] };
    let depth = 0;

    async function advanceQuery(query: string) {
        depth++;
        queryResults = await queryAdvance(query);
        rebouncedInfoPlayingRefresh();
    }

    async function retraceQuery(index: number) {
        const count = queryResults.queryInfo.length - 1 - index;
        // console.log(`retracing ${count}x`, index, queryResults.queryInfo.length);
        if (count >= 2) await queryRetrace();
        if (count >= 1) await queryRetrace();
        queryResults = await queryRetrace();
        depth -= count;
        rebouncedInfoPlayingRefresh();
    }

    onMount(async () => {
        queryResults = await queryRetrace();
    });
</script>

{#await playingInfo.load() then}
    <div class="query-container">
        <div class="breadcrumbs">
            {#if queryResults.queryInfo.length}
                {#each queryResults.queryInfo as breadcrumb, i}
                    {#if i > 0}
                        &nbsp;/
                    {/if}
                    <span class="breadcrumb" on:click={() => retraceQuery(i)} on:keydown={noop}>
                        {breadcrumb}
                    </span>
                {/each}
            {:else}
                <span class="no-query">Library Genres</span>
            {/if}
        </div>
        <div class="query">
            {#each queryResults.query as queryItem, i}
                <div class="item" on:click={() => advanceQuery(queryItem)} on:keydown={noop}>
                    {queryItem}
                </div>
            {/each}
        </div>
    </div>
{/await}

<style lang="scss">
    @import '@css/colors.scss';
    @import '@css/constants.scss';

    $query-width: 25vw;

    .query-container {
        position: absolute;
        right: 1rem;
        top: calc($total-header-height - 1rem);
        background-color: $panel-bg;
        padding: 0.5rem 1rem 1rem;
        border: 1px solid black;
        border-radius: 6px;
        width: $query-width;
        max-width: $query-width;

        .breadcrumbs {
            // height: 1.5rem;
            line-height: 1.5rem;
            border-bottom: 1px solid black;
            box-sizing: border-box;
            margin-bottom: 0.5rem;

            .breadcrumb {
                &:hover {
                    background-color: var(--primary);
                    cursor: pointer;
                }
            }

            .no-query {
                color: rgba(255, 255, 255, 0.6);
            }
        }

        .query {
            height: calc(100vh - $total-header-height - $total-progress-height - 6rem);
            max-height: calc(100vh - $total-header-height - $total-progress-height - 6rem);
            overflow-y: scroll;

            .item {
                font-size: 14px;
                &:hover {
                    background-color: var(--primary);
                    cursor: pointer;
                }
            }
        }
    }
</style>
