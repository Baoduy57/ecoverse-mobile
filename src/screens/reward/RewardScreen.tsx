import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function RewardScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="gift" size={80} color={colors.accent} />
                <Text style={styles.title}>Đổi Quà</Text>
                <Text style={styles.subtitle}>Tính năng đang được phát triển</Text>
                <Text style={styles.description}>
                    Sắp có thể đổi điểm sinh thái của bạn lấy những phần quà hấp dẫn!
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
        color: colors.accent,
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
