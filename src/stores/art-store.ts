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
import { writable, type StartStopNotifier } from 'svelte/store';

interface ThemeColors {
    color: string;
    accent: string;
    darkAccent: string;
    lightAccent: string;
    textColor: string;
    dimTextColor: string;
}

class ThemeStore {
    subscribe: StartStopNotifier<ThemeColors>;
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

    public async getArtColors(path: string) {
        try {
            const cols = await extractColors(path, extractOptions);
            this.processColors(cols.map(fc => createColor(fc.red, fc.green, fc.blue, fc.area)));
        } catch (e) {
            console.error(e);
        }
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
            const regLightness = 0.26 + 2.34 * c.lightness - 2.8 * c.lightness * c.lightness;
            const regBrightness = 0.26 + 2.34 * c.brightness - 2.8 * c.brightness * c.brightness;
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

        if (primary.brightness < 0.16) {
            darkAccent = shadeColor(primary, 35);
            accent = tintColor(primary, 10);
            lightAccent = tintColor(primary, 20);
        } else if (primary.brightness > 0.78) {
            // very bright
            darkAccent = shadeColor(primary, 30);
            accent = shadeColor(primary, 20);
            lightAccent = shadeColor(primary, 10);
            textColor = createColor(0, 0, 0);
            dimTextColor = rgbaToHex(0, 0, 0, 0.7);
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
