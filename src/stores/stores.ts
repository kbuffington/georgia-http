import { writable } from 'svelte/store';
import storage from './persistent-store';

export const artColor = writable('#00007f');

export const searchString = writable('');

interface UserSettings {
    useMocks: boolean;
}

const defaultSettings: UserSettings = {
    useMocks: false,
};

export const userSettings = storage<UserSettings>('userSettings', defaultSettings);
