export const convertToRoman = (num: number) => {
    const roman: { [key: string]: number } = {
        // we should never see disc numbers over 100 so commenting these out for speed
        // M: 1000,
        // CM: 900,
        // D: 500,
        // CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    };
    let str = '';

    for (const i of Object.keys(roman)) {
        const q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
    }

    return str;
};
