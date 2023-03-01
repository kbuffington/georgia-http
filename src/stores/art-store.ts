// import Color from 'extract-colors/lib/color/Color';
import { createFinalColor, Color, type FinalColor, extractOptions } from '@api/artwork';
import { extractColors } from 'extract-colors';
// import { createFinalColor } from 'extract-colors/lib/color/FinalColor';
// import type { FinalColor } from 'extract-colors/lib/types/Color';
import { writable, type StartStopNotifier } from 'svelte/store';
import { artColor } from './stores';

interface ThemeColors {
    color: FinalColor;
    shade: FinalColor;
    tint: FinalColor;
}

const defaultTheme: ThemeColors = {
    color: createFinalColor(new Color(0, 0, 0), 1),
    shade: createFinalColor(new Color(0, 0, 0), 1),
    tint: createFinalColor(new Color(0, 0, 0), 1),
};

class ThemeStore {
    subscribe: StartStopNotifier<ThemeColors>;
    _set: any;
    _update: any;

    constructor() {
        const { subscribe, set, update } = writable(defaultTheme);
        this.subscribe = subscribe;
        this._set = set;
        this._update = update;
    }

    public setColor(color: number) {
        this._set(this.getNewThemeColors(color));
    }

    public getArtColors(path: string) {
        extractColors(path, extractOptions)
            .then(cols => {
                this.processColors(cols);
            })
            .catch(console.error);
    }

    public processColors(colors: FinalColor[]) {
        // do something
        let maxWeight = 0;
        let selectedCol: FinalColor = colors[0];
        const filteredCols = colors.sort((a, b) => b.area - a.area).filter(c => c.area > 0.001);
        filteredCols.forEach((c, i) => {
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
        console.log(colors.sort((a, b) => b.weight! - a.weight!));
        artColor.set(selectedCol.hex);
    }

    private getNewThemeColors(color: number): ThemeColors {
        const themeCol = createFinalColor(new Color(0, 0, 0, color), 1);
        return {
            color: themeCol,
            shade: themeCol,
            tint: themeCol,
        };
    }
}

export const theme = new ThemeStore();
