import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';

interface EcoPreloaderProps {
    isCompleting?: boolean;
    onCycleEnd?: () => void;
}

const EcoPreloader = ({ isCompleting, onCycleEnd }: EcoPreloaderProps) => {
    const leaf1 = useRef(new Animated.Value(0)).current;
    const leaf2 = useRef(new Animated.Value(0)).current;
    const leaf3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let isStopped = false;

        const createLeafSequence = (value: Animated.Value) => {
            return Animated.sequence([
                Animated.timing(value, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(value, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                }),
            ]);
        };

        const runCycle = () => {
            if (isStopped) return;

            Animated.stagger(200, [
                createLeafSequence(leaf1),
                createLeafSequence(leaf2),
                createLeafSequence(leaf3),
            ]).start(() => {
                if (isCompleting) {
                    onCycleEnd?.();
                } else {
                    runCycle();
                }
            });
        };

        runCycle();

        return () => {
            isStopped = true;
            leaf1.stopAnimation();
            leaf2.stopAnimation();
            leaf3.stopAnimation();
        };
    }, [isCompleting, onCycleEnd, leaf1, leaf2, leaf3]);

    const leafStyle = (value: Animated.Value) => ({
        transform: [
            {
                translateY: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                }),
            },
            {
                scale: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                }),
            },
        ],
        opacity: value.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
        }),
    });

    return (
        <View style={styles.ecoPreloaderContainer}>
            <View style={styles.leavesRow}>
                <Animated.View style={[leafStyle(leaf1), { marginRight: 15 }]}>
                    <MaterialCommunityIcons name="leaf" size={24} color={colors.primaryLight} />
                </Animated.View>
                <Animated.View style={[leafStyle(leaf2), { marginRight: 15 }]}>
                    <MaterialCommunityIcons name="leaf" size={32} color={colors.primary} />
                </Animated.View>
                <Animated.View style={leafStyle(leaf3)}>
                    <MaterialCommunityIcons name="leaf" size={24} color={colors.primaryDark} />
                </Animated.View>
            </View>
            <Text style={styles.ecoLoadingText}>Khám phá thêm rác để phân loại...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    ecoPreloaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    leavesRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    ecoLoadingText: {
        color: colors.primaryDark,
        fontSize: 14,
        fontWeight: '600',
        fontStyle: 'italic',
        opacity: 0.8,
    },
});

export default EcoPreloader;
