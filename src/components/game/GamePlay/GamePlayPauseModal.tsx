import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../../theme';

interface GamePlayPauseModalProps {
    visible: boolean;
    onResume: () => void;
    onReplay: () => void;
    onGoHome: () => void;
}

export default function GamePlayPauseModal({
    visible,
    onResume,
    onReplay,
    onGoHome,
}: GamePlayPauseModalProps) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(false);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                {/* Background dismissal area */}
                <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onResume} />

                {/* Container that captures touches to prevent dismissing */}
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>

                        {/* Top Icon */}
                        <View style={styles.topIconWrap}>
                            <View style={styles.topIconInner}>
                                <MaterialCommunityIcons name="pause" size={36} color="#1B5E20" />
                            </View>
                        </View>

                        <Text style={styles.title}>Game Tạm Dừng</Text>

                        {/* Action Buttons */}
                        <TouchableOpacity style={styles.primaryButton} onPress={onResume} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="play" size={24} color={colors.text.white} />
                            <Text style={styles.primaryButtonText}>Tiếp tục</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={onReplay} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="refresh" size={24} color="#1B5E20" />
                            <Text style={styles.secondaryButtonText}>Chơi lại</Text>
                        </TouchableOpacity>

                        {/* Settings Block */}
                        <View style={styles.settingsBlock}>
                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <View style={[styles.settingIconWrap, { backgroundColor: '#E3F2FD' }]}>
                                        <MaterialCommunityIcons name="volume-high" size={20} color="#1976D2" />
                                    </View>
                                    <Text style={styles.settingLabel}>Âm thanh</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.switchTrack, soundEnabled ? styles.switchTrackOn : styles.switchTrackOff]}
                                    onPress={() => setSoundEnabled(!soundEnabled)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.switchThumb, soundEnabled ? styles.switchThumbOn : styles.switchThumbOff]} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingLeft}>
                                    <View style={[styles.settingIconWrap, { backgroundColor: '#FFEBEE' }]}>
                                        <MaterialCommunityIcons name="vibrate" size={20} color="#D32F2F" />
                                    </View>
                                    <Text style={styles.settingLabel}>Rung</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.switchTrack, vibrationEnabled ? styles.switchTrackOn : styles.switchTrackOff]}
                                    onPress={() => setVibrationEnabled(!vibrationEnabled)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.switchThumb, vibrationEnabled ? styles.switchThumbOn : styles.switchThumbOff]} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Go Home */}
                        <TouchableOpacity style={styles.goHomeBtn} onPress={onGoHome} activeOpacity={0.8}>
                            <MaterialCommunityIcons name="home" size={24} color="#424242" />
                            <Text style={styles.goHomeText}>Về trang chủ</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    goHomeBtn: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.xl,
        padding: spacing.sm,
    },
    goHomeText: {
        color: '#424242',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 40,
        marginHorizontal: spacing.xl,
        paddingBottom: 40,
        paddingHorizontal: spacing.xl,
        paddingTop: 40,
        width: '85%',
    },
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        flex: 1,
        justifyContent: 'center',
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: '#1B5E20',
        borderRadius: 30,
        elevation: 3,
        flexDirection: 'row',
        gap: spacing.sm,
        justifyContent: 'center',
        marginBottom: spacing.md,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '100%',
    },
    primaryButtonText: {
        color: colors.text.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderRadius: 30,
        flexDirection: 'row',
        gap: spacing.sm,
        justifyContent: 'center',
        marginBottom: spacing.xl,
        paddingVertical: 16,
        width: '100%',
    },
    secondaryButtonText: {
        color: '#1B5E20',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingIconWrap: {
        alignItems: 'center',
        borderRadius: 20,
        height: 40,
        justifyContent: 'center',
        width: 40,
    },
    settingLabel: {
        color: '#212121',
        fontSize: 15,
        fontWeight: '700',
    },
    settingLeft: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing.md,
    },
    settingRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    settingsBlock: {
        backgroundColor: '#F1F8E9',
        borderRadius: 24,
        gap: spacing.lg,
        padding: spacing.xl,
        width: '100%',
    },
    switchThumb: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        height: 24,
        position: 'absolute',
        top: 2,
        width: 24,
    },
    switchThumbOff: {
        left: 2,
    },
    switchThumbOn: {
        right: 2,
    },
    switchTrack: {
        borderRadius: 14,
        height: 28,
        position: 'relative',
        width: 48,
    },
    switchTrackOff: {
        backgroundColor: '#E0E0E0',
    },
    switchTrackOn: {
        backgroundColor: '#1B5E20',
    },
    title: {
        color: '#1B5E20',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: spacing.xl,
        marginTop: spacing.md,
    },
    topIconInner: {
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#FFF',
        height: 70,
        justifyContent: 'center',
        width: 70,
    },
    topIconWrap: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 44,
        elevation: 2,
        height: 78,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: 78,
    },
});
