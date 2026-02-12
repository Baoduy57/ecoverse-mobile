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
                <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text.primary} />
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <Tooltip content="Điểm sinh thái tích lũy">
                    <StatItem icon="star" value={`${stats.ecoPoints} điểm`} color={colors.accent} />
                </Tooltip>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <MaterialCommunityIcons name="account" size={24} color={colors.text.secondary} />
                    </View>
                )}
            </View>
        </View>
    );
}

interface StatItemProps {
    icon: string;
    value: number | string;
    color: string;
}

function StatItem({ icon, value, color }: StatItemProps) {
    return (
        <View style={styles.statItem}>
            <MaterialCommunityIcons name={icon as any} size={28} color={color} />
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, // Scaled 1.2x
        paddingVertical: 14, // Scaled 1.2x
        backgroundColor: 'transparent',
        elevation: 0, // Explicitly remove Android shadow
        shadowOpacity: 0, // Explicitly remove iOS shadow
        borderBottomWidth: 0, // Ensure no border
    },
    backButton: {
        padding: 6, // Scaled
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, // Scaled
        backgroundColor: '#fff4d7ff', // Card background
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statValue: {
        fontSize: 19, // Scaled 1.2x
        fontWeight: '700',
    },
    avatarContainer: {
        width: 40, // Scaled 1.2x
        height: 40,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarPlaceholder: {
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
