<script lang="ts">
    import { fb } from '@stores/fb-store';

    export let size = 200;
</script>

<div class="pause-container" style="--size:{size}px;">
    <div class="pause-img">
        <span class="material-symbols-outlined pause-text"> pause </span>
    </div>
</div>

<style lang="scss">
    .pause-container {
        background: rgba(0, 0, 0, 0.66);
        border-radius: 1rem;
        border: 2px solid rgba(0, 0, 0, 0.75);
        position: absolute;
        left: calc(50% - var(--size) / 2);
        top: calc(50% - var(--size) / 2);
        pointer-events: none;

        .pause-img {
            min-width: var(--size);
            max-width: var(--size);
            min-height: var(--size);
            max-height: var(--size);
            color: rgba(255, 255, 255, 0.7);
            // font-size: calc(var(--size) / 2);

            .pause-text {
                display: block;
                font-size: var(--size);
                line-height: var(--size);
                width: 100%;
                text-align: center;
                font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 200, 'opsz' 48;
            }
        }
    }
</style>
