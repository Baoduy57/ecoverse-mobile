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
                    <Text style={styles.description}>{stage.description}</Text>

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
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 16,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    content: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
    },
    leftSection: {
        flex: 0.4,
        justifyContent: 'space-between',
    },
    rightSection: {
        flex: 0.6,
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.text.white,
        opacity: 0.8,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.white,
        marginTop: 4,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 24,
        marginTop: 12,
        gap: 8,
        alignSelf: 'flex-start',
        elevation: 2,
    },
    playText: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.primary,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.text.white,
        opacity: 0.95,
        marginBottom: 12,
    },
    statsContainer: {
        gap: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.white,
        opacity: 0.9,
    },
});
