// import Color from 'extract-colors/lib/color/Color';
import {
    createFinalColor,
    type FinalColor,
    extractOptions,
    shadeColor,
    tintColor,
} from '@api/color';
import { extractColors } from 'extract-colors';
import { writable, type StartStopNotifier } from 'svelte/store';
import { artColor } from './stores';

interface ThemeColors {
    color: string;
    accent: string;
    darkAccent: string;
    lightAccent: string;
    textColor: string;
}

class ThemeStore {
    subscribe: StartStopNotifier<ThemeColors>;
    primary: string;
    _set: any;
    _update: any;

    constructor() {
        const defaultTheme = this.getNewThemeColors(0, 0, 128);
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
            this.processColors(cols);
        } catch (e) {
            console.error(e);
        }
    }

    public processColors(colors: FinalColor[]) {
        // do something
        let maxWeight = 0;
        let selectedCol: FinalColor = colors[0];
        const filteredCols = colors.sort((a, b) => b.area - a.area).filter(c => c.area > 0.001);
        filteredCols.forEach(c => {
            const midLightness = 0.5 - Math.abs(0.5 - c.lightness);
            c.weight = midLightness * c.area;

            // Quadratic lightness regression: 0.35 + 2.34x - 2.8x^2
            const regLightness = 0.26 + 2.34 * c.lightness - 2.8 * c.lightness * c.lightness;
            c.weight = regLightness * c.area;
            // console.log(
            //     `rgb(${c.red}, ${c.green}, ${c.blue}, lightness: ${c.lightness}, weight: ${c.weight}`
            // );
            if (c.weight > maxWeight) {
                selectedCol = c;
                maxWeight = c.weight;
            }
        });
        // console.log(selectedCol);
        // console.log(colors.sort((a, b) => b.weight! - a.weight!));
        artColor.set(selectedCol.hex);
        if (selectedCol.hex !== this.primary) {
            console.log(`color changed from: ${this.primary} => ${selectedCol.hex}`);
            this.setColor(selectedCol.red, selectedCol.green, selectedCol.blue);
        }
    }

    private getNewThemeColors(red: number, green: number, blue: number): ThemeColors {
        const primary = createFinalColor(red, green, blue);
        let accent: FinalColor;
        let darkAccent: FinalColor;
        let lightAccent: FinalColor;
        let textColor = createFinalColor(255, 255, 255);

        if (primary.lightness < 0.16) {
            darkAccent = shadeColor(primary, 35);
            accent = tintColor(primary, 10);
            lightAccent = tintColor(primary, 20);
        } else if (primary.lightness > 0.825) {
            // very bright
            darkAccent = shadeColor(primary, 30);
            accent = shadeColor(primary, 20);
            lightAccent = shadeColor(primary, 10);
            textColor = createFinalColor(0, 0, 0);
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
        };
    }
}

export const theme = new ThemeStore();
