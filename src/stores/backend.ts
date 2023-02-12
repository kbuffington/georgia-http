import { get_store_value } from 'svelte/internal';
import { userSettings } from './stores';

const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const refreshPlayingInfo = async (): Promise<Response> => {
    const { useMocks } = get_store_value(userSettings);
    if (useMocks) {
        await timeout(1000);
        return await fetch('/mockdata/fake-backend-data.json');
    } else {
        // return await fetch('/mockdata/fake-backend-data2.json');
        return await fetch('/georgia/?cmd=RefreshPlayingInfo&param3=js/state.json');
    }
};
