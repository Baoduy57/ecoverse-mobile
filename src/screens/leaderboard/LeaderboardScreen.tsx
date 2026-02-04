import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function LeaderboardScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="trophy" size={80} color={colors.primary} />
                <Text style={styles.title}>Bảng Xếp Hạng</Text>
                <Text style={styles.subtitle}>Tính năng đang được phát triển</Text>
                <Text style={styles.description}>
                    Sắp có thể xem thành tích của bạn và so sánh với những người chơi khác!
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginTop: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
