import { get_store_value } from 'svelte/internal';
import { userSettings } from '@stores/stores';
import { rebounce } from '@square/svelte-store';
import { sendCommand } from './commands';

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const refreshPlayingInfoCall = async (): Promise<Response> => {
    console.log('refreshing playingInfo');
    const { useMocks } = get_store_value(userSettings);
    if (useMocks) {
        await timeout(1000);
        return await fetch('/mockdata/fake-backend-data.json');
    } else {
        // return await fetch('/mockdata/fake-backend-data2.json');
        return await sendCommand('RefreshPlayingInfo', undefined, undefined, 'schema/state.json');
    }
};

export const refreshPlayingInfo = rebounce(refreshPlayingInfoCall, 100);

class StripXmlEntities {
    public values: { [key: string]: string } = {
        '&#39;': "'",
        '&#92;': '\\',
        '&quot;': '"',
        '&gt;': '>',
        '&lt;': '<',
        '&amp;': '&',
    };
    private regexp: RegExp;

    constructor() {
        let regexp_str = '';
        Object.keys(this.values).forEach(key => {
            if (regexp_str != '') regexp_str += '|';
            else regexp_str = '(';
            regexp_str += key;
        });
        regexp_str += ')';
        this.regexp = new RegExp(regexp_str, 'g');
    }

    public perform = (str: string) => {
        return str.replace(this.regexp, (match: string): string => {
            return this.values[match];
        });
    };
}
export const stripXmlEntities = new StripXmlEntities();
