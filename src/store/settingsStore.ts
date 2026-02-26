import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BG_TRACKS: { key: string; label: string }[] = [
    { key: 'chill.mp3', label: 'Chill' },
    { key: 'Quiz_Cloud_Drift.mp3', label: 'Cloud Drift' },
    { key: 'Cloud_Drift_2.mp3', label: 'Cloud Drift 2' },
];

const STORAGE_KEY = '@ecoverse_settings';

interface SettingsState {
    bgMusicEnabled: boolean;
    sfxInteractionEnabled: boolean;
    sfxFeedbackEnabled: boolean;
    currentBgTrack: string;

    // Actions
    setBgMusic: (value: boolean) => void;
    setSfxInteraction: (value: boolean) => void;
    setSfxFeedback: (value: boolean) => void;
    setBgTrack: (trackKey: string) => void;
    loadSettings: () => Promise<void>;
}

const saveToStorage = async (data: Partial<SettingsState>) => {
    try {
        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        const current = existing ? JSON.parse(existing) : {};
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
    } catch (e) {
        console.warn('Settings save error:', e);
    }
};

export const useSettingsStore = create<SettingsState>((set) => ({
    bgMusicEnabled: true,
    sfxInteractionEnabled: true,
    sfxFeedbackEnabled: true,
    currentBgTrack: BG_TRACKS[0].key,

    setBgMusic: (value) => {
        set({ bgMusicEnabled: value });
        saveToStorage({ bgMusicEnabled: value });
    },

    setSfxInteraction: (value) => {
        set({ sfxInteractionEnabled: value });
        saveToStorage({ sfxInteractionEnabled: value });
    },

    setSfxFeedback: (value) => {
        set({ sfxFeedbackEnabled: value });
        saveToStorage({ sfxFeedbackEnabled: value });
    },

    setBgTrack: (trackKey) => {
        set({ currentBgTrack: trackKey });
        saveToStorage({ currentBgTrack: trackKey });
    },

    loadSettings: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                set({
                    bgMusicEnabled: parsed.bgMusicEnabled ?? true,
                    sfxInteractionEnabled: parsed.sfxInteractionEnabled ?? true,
                    sfxFeedbackEnabled: parsed.sfxFeedbackEnabled ?? true,
                    currentBgTrack: parsed.currentBgTrack ?? BG_TRACKS[0].key,
                });
            }
        } catch (e) {
            console.warn('Settings load error:', e);
        }
    },
}));
