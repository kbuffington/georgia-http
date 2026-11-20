// import Color from 'extract-colors/lib/color/Color';
import {
    createColor,
    type Color,
    extractOptions,
    shadeColor,
    tintColor,
    getBrightness,
} from '@api/color';
import { extractColors } from 'extract-colors';
import { writable, type Readable } from 'svelte/store';

interface ThemeColors {
    color: string;
    accent: string;
    darkAccent: string;
    lightAccent: string;
    textColor: string;
    dimTextColor: string;
    activeTextColor: string;
}

class ThemeStore {
    subscribe: Readable<ThemeColors>['subscribe'];
    primary: string;
    _set: any;
    _update: any;
    weightSort = (a: Color, b: Color) => (b.weight ?? 0) - (a.weight ?? 0);

    constructor() {
        const defaultTheme = this.getNewThemeColors(0, 120, 120);
        const { subscribe, set, update } = writable(defaultTheme);
        this.primary = defaultTheme.color;
        this.subscribe = subscribe;
        this._set = set;
        this._update = update;
    }

    public setColor(red: number, green: number, blue: number) {
        this._set(this.getNewThemeColors(red, green, blue));
    }

    // extracted palettes by image URL; the main and mini artwork load the same image at about the
    // same time, so caching the in-flight promise means the work is only done once
    private paletteCache = new Map<string, Promise<Color[] | undefined>>();
    private static PALETTE_CACHE_SIZE = 5;

    /** Picks the theme color from an already-loaded <img>. */
    public async getArtColors(img: HTMLImageElement) {
        const key = img.currentSrc || img.src;
        let palette = this.paletteCache.get(key);
        if (!palette) {
            palette = this.extractPalette(img);
            this.paletteCache.set(key, palette);
            // Map keeps insertion order, so the first key is the oldest
            while (this.paletteCache.size > ThemeStore.PALETTE_CACHE_SIZE) {
                this.paletteCache.delete(this.paletteCache.keys().next().value!);
            }
        }
        const colors = await palette;
        if (colors) {
            this.processColors(colors);
        } else {
            this.paletteCache.delete(key); // failed; allow a retry on the next load
        }
    }

    /**
     * Extracts the palette from the displayed image's own pixels rather than re-fetching its URL.
     *
     * Shrinking a large image straight from the <img> in one drawImage (e.g. 3000x3000 -> 100x100)
     * made the sampled pixels depend on how the browser decoded/scaled the image on that load, so
     * art whose top two colors score almost the same flipped between them on refresh. Instead,
     * copy the image 1:1 (exact pixels), then halve it repeatedly with smoothing so each sampled
     * pixel is an average of its area — stable, and representative of what's on screen.
     */
    private async extractPalette(img: HTMLImageElement): Promise<Color[] | undefined> {
        try {
            const { naturalWidth: nw, naturalHeight: nh } = img;
            if (!nw || !nh) return undefined;
            const targetPixels = extractOptions.pixels ?? 64000;

            // exact 1:1 copy (bounded so a truly huge image can't use excessive memory)
            const MAX_PIXELS = 4096 * 4096;
            const fit = Math.min(1, Math.sqrt(MAX_PIXELS / (nw * nh)));
            let canvas = this.drawToCanvas(img, Math.floor(nw * fit), Math.floor(nh * fit));
            // halve until close to the target size, then one final step to it
            while (canvas.width * canvas.height > targetPixels * 4) {
                canvas = this.drawToCanvas(
                    canvas,
                    Math.floor(canvas.width / 2),
                    Math.floor(canvas.height / 2)
                );
            }
            const finalScale = Math.min(
                1,
                Math.sqrt(targetPixels / (canvas.width * canvas.height))
            );
            canvas = this.drawToCanvas(
                canvas,
                Math.round(canvas.width * finalScale),
                Math.round(canvas.height * finalScale)
            );
            const { width, height } = canvas;
            const imageData = canvas
                .getContext('2d', { willReadFrequently: true })!
                .getImageData(0, 0, width, height);
            const cols = await extractColors(imageData, extractOptions);
            return cols.map(fc => createColor(fc.red, fc.green, fc.blue, fc.area));
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    /** Draws `source` into a new CPU-backed canvas of the given size, with high-quality smoothing. */
    private drawToCanvas(source: CanvasImageSource, width: number, height: number) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const context = canvas.getContext('2d', { willReadFrequently: true })!;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    public processColors(colors: Color[]) {
        // do something
        let maxWeight = 0;
        let selectedCol: Color = colors[0];
        const filteredCols = colors.sort((a, b) => b.area - a.area).filter(c => c.area > 0.001);
        filteredCols.forEach(c => {
            const midLightness = 0.5 - Math.abs(0.5 - c.lightness);
            c.weight = midLightness * c.area;
            c.brightness = getBrightness(c.red, c.green, c.blue);

            // Quadratic lightness regression: 0.35 + 2.34x -2.8x^2
            // const regLightness = 0.26 + 2.34 * c.lightness - 2.8 * c.lightness * c.lightness;
            // const regBrightness = 0.26 + 2.34 * c.brightness - 2.8 * c.brightness * c.brightness;
            const midBrightness = 0.5 - Math.abs(0.5 - c.brightness);
            const euler = 2.71828;
            const areaWeight = 1 - Math.pow(10 * euler, -5 * c.area);
            // c.weight = regLightness * areaWeight * c.saturation * 10;
            c.weight = midBrightness * areaWeight * Math.sqrt(c.saturation) * 10;
            if (c.isCloseToGreyscale) {
                c.weight /= 2;
            }
            // c.weight = midBrightness * areaWeight * 10;
            // console.log(
            //     c,
            //     `weight: ${c.weight.toFixed(3)}, lightW: ${regLightness.toFixed(
            //         3
            //     )}, areaW: ${areaWeight.toFixed(3)}, sat: ${c.saturation.toFixed(
            //         3
            //     )}, bright: ${regBrightness.toFixed(3)}`
            //     // `rgb(${c.red}, ${c.green}, ${c.blue}, lightness: ${c.lightness}, weight: ${c.weight}`
            // );
            if (c.weight > maxWeight) {
                selectedCol = c;
                maxWeight = c.weight;
            }
        });
        console.log(filteredCols.sort(this.weightSort));
        if (selectedCol.hex !== this.primary) {
            console.log(`color changed from: ${this.primary} => ${selectedCol.hex}`);
            this.primary = selectedCol.hex;
            this.setColor(selectedCol.red, selectedCol.green, selectedCol.blue);
        }
    }

    private getNewThemeColors(red: number, green: number, blue: number): ThemeColors {
        const primary = createColor(red, green, blue);
        let accent: Color;
        let darkAccent: Color;
        let lightAccent: Color;
        let textColor = createColor(255, 255, 255);
        let dimTextColor = rgbaToHex(255, 255, 255, 0.7);
        let activeTextColor = rgbaToHex(255, 255, 255, 1.0);

        if (primary.brightness < 0.16) {
            darkAccent = shadeColor(primary, 35);
            accent = tintColor(primary, 10);
            lightAccent = tintColor(primary, 20);
        } else if (primary.brightness > 0.78) {
            // very bright
            darkAccent = shadeColor(primary, 30);
            accent = shadeColor(primary, 20);
            lightAccent = shadeColor(primary, 10);
            textColor = createColor(15, 15, 15);
            dimTextColor = rgbaToHex(0, 0, 0, 0.7);
            activeTextColor = rgbaToHex(0, 0, 0, 1.0);
        } else {
            // default
            darkAccent = shadeColor(primary, 30);
            accent = shadeColor(primary, 15);
            lightAccent = tintColor(primary, 20);
        }

        return {
            color: primary.hex,
            accent: accent.hex,
            darkAccent: darkAccent.hex,
            lightAccent: lightAccent.hex,
            textColor: textColor.hex,
            dimTextColor,
            activeTextColor,
        };
    }
}

export const theme = new ThemeStore();

function rgbaToHex(r: number, g: number, b: number, a: number) {
    let rVal = r.toString(16);
    let gVal = g.toString(16);
    let bVal = b.toString(16);
    let aVal = Math.round(a * 255).toString(16);

    if (rVal.length == 1) rVal = '0' + rVal;
    if (gVal.length == 1) gVal = '0' + gVal;
    if (bVal.length == 1) bVal = '0' + bVal;
    if (aVal.length == 1) aVal = '0' + aVal;

    return '#' + rVal + gVal + bVal + aVal;
}
