import { get_store_value } from 'svelte/internal';
import { userSettings } from '@stores/stores';
import { rebounce } from '@square/svelte-store';

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
        return await fetch(
            window.location.origin + '/georgia/?cmd=RefreshPlayingInfo&param3=schema/state.json'
        );
    }
};

export const refreshPlayingInfo = rebounce(refreshPlayingInfoCall, 100);
