import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import type { Level } from '../../types/game';

interface LearningPathNodeProps {
    level: Level;
    position: { x: number; y: number };
    onPress: (level: Level) => void;
}

export default function LearningPathNode({ level, position, onPress }: LearningPathNodeProps) {
    const { x, y } = position;
    const isCurrent = level.status === 'current';
    const isLocked = level.status === 'locked';
    const isCompleted = level.status === 'completed';

    // Animation for current node
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isCurrent) {
            const pulse = Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(scale, {
                            toValue: 1.1,
                            duration: 1000,
                            useNativeDriver: true,
                            easing: Easing.inOut(Easing.ease),
                        }),
                        Animated.timing(scale, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                            easing: Easing.inOut(Easing.ease),
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(translateY, {
                            toValue: -5,
                            duration: 1000,
                            useNativeDriver: true,
                            easing: Easing.inOut(Easing.ease),
                        }),
                        Animated.timing(translateY, {
                            toValue: 0,
                            duration: 1000,
                            useNativeDriver: true,
                            easing: Easing.inOut(Easing.ease),
                        }),
                    ]),
                ])
            );
            pulse.start();

            return () => pulse.stop();
        }
    }, [isCurrent, scale, translateY]);

    const backgroundColor = isLocked
        ? colors.text.disabled
        : isCurrent
            ? colors.primary
            : colors.primaryDark;

    const nodeSize = isCurrent ? 80 : 70;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    left: x - nodeSize / 2,
                    top: y - nodeSize / 2,
                    transform: [{ scale }, { translateY }],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPress(level)}
                disabled={isLocked}
                style={[
                    styles.node,
                    {
                        width: nodeSize,
                        height: nodeSize,
                        borderRadius: nodeSize / 2,
                        backgroundColor,
                        borderColor: isCurrent ? colors.surface : 'transparent',
                        borderWidth: isCurrent ? 4 : 0,
                        elevation: isLocked ? 0 : 6,
                    },
                ]}
            >
                {isLocked ? (
                    <MaterialCommunityIcons name="lock" size={28} color={colors.surface} style={{ opacity: 0.7 }} />
                ) : (
                    <MaterialCommunityIcons
                        name={level.icon as any}
                        size={isCurrent ? 36 : 32}
                        color={isCompleted ? colors.accent : colors.surface}
                    />
                )}
            </TouchableOpacity>

            {/* Label */}
            {!isLocked && (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>{level.title}</Text>
                </View>
            )}

            {/* Best Score */}
            {level.bestScore && !isLocked && (
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Best {level.bestScore}</Text>
                </View>
            )}

            {/* START Badge */}
            {level.isCurrent && (
                <View style={styles.startBadge}>
                    <MaterialCommunityIcons name="fire" size={12} color={colors.text.primary} />
                    <Text style={styles.startText}>START</Text>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
    },
    node: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    labelContainer: {
        marginTop: 8,
        backgroundColor: colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    labelText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.text.primary,
        textAlign: 'center',
    },
    scoreContainer: {
        marginTop: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    scoreText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    startBadge: {
        position: 'absolute',
        top: -12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.surface,
        elevation: 4,
        gap: 2,
    },
    startText: {
        fontSize: 9,
        fontWeight: '800',
        color: colors.text.primary,
    },
});
