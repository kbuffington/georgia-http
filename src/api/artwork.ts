// import Color from 'extract-colors';

import type { BrowserOptions } from 'extract-colors/lib/types/Options';

export const extractOptions: BrowserOptions = {
    pixels: 10000,
    distance: 0.1,
    splitPower: 10,
    colorValidator: (red: number, green: number, blue: number, alpha = 255) => alpha > 250,
    saturationDistance: 0.1,
    lightnessDistance: 0.1,
    hueDistance: 0.063333333,
};

// taken from node_modules\extract-colors\lib\extract-colors.node.es.js
export class Color {
    _red: number;
    _green: number;
    _blue: number;
    _hex: number;
    _count: number;
    private __saturation;
    private __hue;
    private __lightness;
    private __intensity;

    constructor(red: number, green: number, blue: number, hex = (red << 16) | (green << 8) | blue) {
        this._count = 1;
        this.__saturation = -1;
        this.__hue = -1;
        this.__lightness = -1;
        this.__intensity = -1;
        this._red = red;
        this._green = green;
        this._blue = blue;
        this._hex = hex;
    }
    static distance(colorA: Color, colorB: Color) {
        return (
            (Math.abs(colorB._red - colorA._red) +
                Math.abs(colorB._green - colorA._green) +
                Math.abs(colorB._blue - colorA._blue)) /
            (3 * 255)
        );
    }
    updateHSL() {
        const red = this._red / 255;
        const green = this._green / 255;
        const blue = this._blue / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        this.__lightness = (max + min) / 2;
        if (max === min) {
            this.__hue = 0;
            this.__saturation = 0;
            this.__intensity = 0;
        } else {
            const distance2 = max - min;
            this.__saturation =
                this.__lightness > 0.5 ? distance2 / (2 - max - min) : distance2 / (max + min);
            this.__intensity = this.__saturation * ((0.5 - Math.abs(0.5 - this.__lightness)) * 2);
            switch (max) {
                case red:
                    this.__hue = ((green - blue) / distance2 + (green < blue ? 6 : 0)) / 6;
                    break;
                case green:
                    this.__hue = ((blue - red) / distance2 + 2) / 6;
                    break;
                case blue:
                    this.__hue = ((red - green) / distance2 + 4) / 6;
                    break;
            }
        }
    }
    get _hue() {
        if (this.__hue === -1) {
            this.updateHSL();
        }
        return this.__hue;
    }
    get _saturation() {
        if (this.__saturation === -1) {
            this.updateHSL();
        }
        return this.__saturation;
    }
    get _lightness() {
        if (this.__lightness === -1) {
            this.updateHSL();
        }
        return this.__lightness;
    }
    get _intensity() {
        if (this.__intensity === -1) {
            this.updateHSL();
        }
        return this.__intensity;
    }
}

// export class MyColor extends Color {
//     weight: number;

//     constructor(red: number, green: number, blue: number, hex = (red << 16) | (green << 8) | blue) {
//         super(red, green, blue, hex);
//         this.weight = 0;
//     }
// }

export const createFinalColor = (color: Color, pixels: number) => {
    return {
        hex: `#${'0'.repeat(6 - color._hex.toString(16).length)}${color._hex.toString(16)}`,
        red: color._red,
        green: color._green,
        blue: color._blue,
        area: color._count / pixels,
        hue: color._hue,
        saturation: color._saturation,
        lightness: color._lightness,
        intensity: color._intensity,
    };
};

export declare type FinalColor = {
    hex: string;
    red: number;
    green: number;
    blue: number;
    area: number;
    hue: number;
    saturation: number;
    lightness: number;
    intensity: number;
    weight?: number;
};
