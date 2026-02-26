import { useEffect } from 'react';
import { useSettingsStore } from '@store/settingsStore';
import { audioService } from '@services/audioService';

/**
 * Global audio bootstrap — gọi 1 lần duy nhất trong App.tsx.
 * Load settings từ AsyncStorage rồi khởi động nhạc nền tự động.
 */
export function useAudioBootstrap() {
    const { loadSettings } = useSettingsStore();

    useEffect(() => {
        (async () => {
            // 1. Load cấu hình âm thanh đã lưu
            await loadSettings();
            // 2. Lấy state mới nhất sau khi load
            const { bgMusicEnabled, currentBgTrack } = useSettingsStore.getState();
            // 3. Init audio mode
            await audioService.init();
            // 4. Phát nhạc nền nếu đang bật
            if (bgMusicEnabled) {
                await audioService.playBgMusic(currentBgTrack);
            }
            // 5. Sync các trạng thái SFX vào service
            const { sfxInteractionEnabled, sfxFeedbackEnabled } = useSettingsStore.getState();
            audioService.setInteractionEnabled(sfxInteractionEnabled);
            audioService.setFeedbackEnabled(sfxFeedbackEnabled);
        })();
    }, []);
}
