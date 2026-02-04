import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import Tooltip from '../common/Tooltip';

interface TopHeaderBarProps {
    onBack?: () => void;
    stats: {
        missions: number;
        streak: number;
        ecoPoints: number;
    };
    avatarUrl?: string;
}

export default function TopHeaderBar({ onBack, stats, avatarUrl }: TopHeaderBarProps) {
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <Tooltip content="Nhiệm vụ đã hoàn thành hôm nay">
                    <StatItem icon="target" value={stats.missions} color={colors.secondary} />
                </Tooltip>
                <Tooltip content="Số ngày liên tiếp bạn đã chơi">
                    <StatItem icon="calendar-check" value={stats.streak} color={colors.primary} />
                </Tooltip>
                <Tooltip content="Điểm sinh thái tích lũy">
                    <StatItem icon="star" value={stats.ecoPoints} color={colors.accent} />
                </Tooltip>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <MaterialCommunityIcons name="account" size={20} color={colors.text.secondary} />
                    </View>
                )}
            </View>
        </View>
    );
}

interface StatItemProps {
    icon: string;
    value: number;
    color: string;
}

function StatItem({ icon, value, color }: StatItemProps) {
    return (
        <View style={styles.statItem}>
            <MaterialCommunityIcons name={icon as any} size={24} color={color} />
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.surface,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 4,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    avatarContainer: {
        width: 32,
        height: 32,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
