import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { AppState, AppStateStatus } from 'react-native';

// Map track key → require() for expo bundler
const BG_TRACK_SOURCES: Record<string, any> = {
    'chill.mp3': require('../../assets/background_sound/chill.mp3'),
    'Quiz_Cloud_Drift.mp3': require('../../assets/background_sound/Quiz_Cloud_Drift.mp3'),
    'Cloud_Drift_2.mp3': require('../../assets/background_sound/Cloud_Drift_2.mp3'),
};

class AudioService {
    private bgSound: Audio.Sound | null = null;
    private currentTrackKey: string | null = null;

    private bgEnabled = true;
    private interactionEnabled = true;
    private feedbackEnabled = true;

    private targetVolume = 0.4;
    private fadeInterval: NodeJS.Timeout | null = null;
    private appStateSubscription: any = null;

    constructor() {
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    }

    private handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (!this.bgEnabled || !this.bgSound) return;

        if (nextAppState === 'active') {
            this.fadeIn();
        } else if (nextAppState === 'background' || nextAppState === 'inactive') {
            this.fadeOut();
        }
    };

    async init() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false, // Ensures audio stops completely if OS kills it
            playsInSilentModeIOS: false,
            shouldDuckAndroid: true,
        });
    }

    // ─── Fading Logic ────────────────────────────────────────────────────────

    private clearFade() {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
    }

    private async fadeOut() {
        if (!this.bgSound) return;
        this.clearFade();

        // Gradual fade out
        let currentVol = this.targetVolume;
        this.fadeInterval = setInterval(async () => {
            currentVol = Math.max(0, currentVol - 0.05);
            if (this.bgSound) {
                await this.bgSound.setVolumeAsync(currentVol);
            }
            if (currentVol <= 0) {
                this.clearFade();
                if (this.bgSound) {
                    await this.bgSound.pauseAsync(); // Pause when silent
                }
            }
        }, 100); // Reduce every 100ms
    }

    private async fadeIn() {
        if (!this.bgSound) return;
        this.clearFade();

        // Ensure it's playing
        await this.bgSound.playAsync();

        // Gradual fade in
        let currentVol = 0;
        await this.bgSound.setVolumeAsync(0);

        this.fadeInterval = setInterval(async () => {
            currentVol = Math.min(this.targetVolume, currentVol + 0.05);
            if (this.bgSound) {
                await this.bgSound.setVolumeAsync(currentVol);
            }
            if (currentVol >= this.targetVolume) {
                this.clearFade();
            }
        }, 100);
    }

    // ─── Background Music ────────────────────────────────────────────────────

    async playBgMusic(trackKey: string) {
        if (!this.bgEnabled) return;
        if (this.currentTrackKey === trackKey && this.bgSound) {
            // If it's already the current track, make sure it's playing and faded in
            await this.fadeIn();
            return;
        }

        await this.stopBgMusic();

        const source = BG_TRACK_SOURCES[trackKey];
        if (!source) return;

        try {
            const { sound } = await Audio.Sound.createAsync(source, {
                isLooping: true,
                volume: 0, // Start silent for fade in
                shouldPlay: true,
            });
            this.bgSound = sound;
            this.currentTrackKey = trackKey;

            // Fade in after loading
            await this.fadeIn();
        } catch (e) {
            console.warn('BG music play error:', e);
        }
    }

    async stopBgMusic() {
        this.clearFade();
        if (this.bgSound) {
            try {
                await this.bgSound.stopAsync();
                await this.bgSound.unloadAsync();
            } catch (_) { }
            this.bgSound = null;
            this.currentTrackKey = null;
        }
    }

    async switchBgTrack(trackKey: string) {
        await this.stopBgMusic();
        if (this.bgEnabled) {
            await this.playBgMusic(trackKey);
        }
    }

    async setBgMusicEnabled(enabled: boolean, currentTrack: string) {
        this.bgEnabled = enabled;
        if (enabled) {
            await this.playBgMusic(currentTrack);
        } else {
            await this.stopBgMusic();
        }
    }

    // ─── SFX ─────────────────────────────────────────────────────────────────

    setInteractionEnabled(enabled: boolean) {
        this.interactionEnabled = enabled;
    }

    setFeedbackEnabled(enabled: boolean) {
        this.feedbackEnabled = enabled;
    }

    async playInteraction() {
        if (!this.interactionEnabled) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    async playFeedback(type: 'correct' | 'wrong') {
        if (!this.feedbackEnabled) return;
        if (type === 'correct') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    }
}

export const audioService = new AudioService();
