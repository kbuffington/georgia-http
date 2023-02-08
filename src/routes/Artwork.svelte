<script>
    import { extractColors } from 'extract-colors';
    import { artColor } from '../stores/stores';

    const imgSrc = '/images/albumart_0000.jpeg';

    extractColors(imgSrc)
        .then(c => {
            // console.log(c);
            artColor.set(c[0].hex);
        })
        .catch(console.error)
</script>

<div class="artwork" style="--color:{$artColor}">
    <div class="metadata">
        test
    </div>
    <img class="albumart" src={imgSrc} alt="album art">
</div>

<style lang="scss">
    @import "../scss/constants.scss";

    .artwork {
        background-color: var(--color);
        padding-left: 1rem;
        width: fit-content;
        display: flex;

        .metadata {
            display: inline-block;
            font-size: 2rem;
            font-weight: 300;
            padding: 1rem 1rem 1rem 0;
            // background:red;
        }

        img.albumart {
            max-width: calc(50vw - 2rem); // TODO figure out max-width/height
            max-height: calc(100vh - $header-height - $progress-bar-time-font-size - $progress-bar-height - 150px);
            display: block; // fix the extra 4 pixels of parent space
        }
    }
</style>