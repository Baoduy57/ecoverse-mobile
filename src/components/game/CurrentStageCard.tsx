import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface Stage {
    id: number;
    title: string;
    description: string;
    playsCount?: number;
    completionRate?: number;
}

interface CurrentStageCardProps {
    stage: Stage;
    onPlay: () => void;
}

export default function CurrentStageCard({ stage, onPlay }: CurrentStageCardProps) {
    // Get topic icon based on stage title
    const getTopicIcon = () => {
        const title = stage.title.toUpperCase();
        if (title.includes('Ủ') || title.includes('PHÂN')) return 'sprout';
        if (title.includes('TÁI CHẾ')) return 'recycle';
        if (title.includes('CƠ BẢN')) return 'check-all';
        if (title.includes('GIẢM')) return 'minus-circle';
        if (title.includes('TÁI DÙNG')) return 'refresh';
        if (title.includes('MUA')) return 'shopping';
        if (title.includes('ĐIỆN')) return 'lightning-bolt';
        if (title.includes('NƯỚC')) return 'water';
        if (title.includes('CHUYỂN')) return 'bike';
        if (title.includes('CHUYÊN')) return 'trophy';
        return 'leaf';
    };

    return (
        <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Left Section - 40% */}
                <View style={styles.leftSection}>
                    <Text style={styles.label}>CURRENT STAGE</Text>
                    <Text style={styles.title}>{stage.title}</Text>

                    <TouchableOpacity style={styles.playButton} onPress={onPlay}>
                        <MaterialCommunityIcons name="play" size={24} color={colors.primary} />
                        <Text style={styles.playText}>PLAY</Text>
                    </TouchableOpacity>
                </View>

                {/* Right Section - 60% */}
                <View style={styles.rightSection}>
                    {/* Topic Icon Background */}
                    <View style={styles.topicIconContainer}>
                        <MaterialCommunityIcons
                            name={getTopicIcon() as any}
                            size={48}
                            color={colors.text.white}
                            style={{ opacity: 0.3 }}
                        />
                    </View>

                    {/* Mascot Speech Bubble */}
                    <View style={styles.speechBubble}>
                        <Text style={styles.mascotText}>🌱</Text>
                        <Text style={styles.description}>{stage.description}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        {stage.playsCount !== undefined && (
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="controller" size={16} color={colors.text.white} />
                                <Text style={styles.statText}>{stage.playsCount} lần chơi</Text>
                            </View>
                        )}
                        {stage.completionRate !== undefined && (
                            <View style={styles.statItem}>
                                <MaterialCommunityIcons name="chart-line" size={16} color={colors.text.white} />
                                <Text style={styles.statText}>{stage.completionRate}% hoàn thành</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        elevation: 4,
        marginHorizontal: 16,
        marginVertical: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        gap: 16,
        padding: 20,
    },
    description: {
        color: colors.text.white,
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.95,
    },
    label: {
        color: colors.text.white,
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        opacity: 0.8,
    },
    leftSection: {
        flex: 0.4,
        justifyContent: 'space-between',
    },
    mascotText: {
        fontSize: 24,
    },
    playButton: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: colors.surface,
        borderRadius: 24,
        elevation: 2,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        marginTop: 12,
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    playText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '800',
    },
    rightSection: {
        flex: 0.6,
        justifyContent: 'center',
        position: 'relative',
    },
    speechBubble: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    statItem: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    statText: {
        color: colors.text.white,
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.9,
    },
    statsContainer: {
        gap: 8,
    },
    title: {
        color: colors.text.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    topicIconContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
});
