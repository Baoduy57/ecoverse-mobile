import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface UnitSeparatorProps {
    y: number;
    width: number;
    unitIndex: number;
}

export default function UnitSeparator({ y, width, unitIndex }: UnitSeparatorProps) {
    const centerX = width / 2;
    const curveHeight = 30;
    const badgeSize = 40;

    return (
        <View style={[styles.container, { top: y, width }]}>
            <Svg height={60} width={width}>
                {/* Decorative curved path - left side */}
                <Path
                    d={`M ${width * 0.1} ${curveHeight} Q ${width * 0.3} ${curveHeight - 10} ${centerX - badgeSize} ${curveHeight}`}
                    stroke={colors.primary}
                    strokeWidth={3}
                    strokeDasharray="8, 4"
                    fill="none"
                    opacity={0.4}
                />

                {/* Decorative curved path - right side */}
                <Path
                    d={`M ${centerX + badgeSize} ${curveHeight} Q ${width * 0.7} ${curveHeight - 10} ${width * 0.9} ${curveHeight}`}
                    stroke={colors.primary}
                    strokeWidth={3}
                    strokeDasharray="8, 4"
                    fill="none"
                    opacity={0.4}
                />

                {/* Center checkpoint badge */}
                <G x={centerX} y={curveHeight}>
                    {/* Outer glow circle */}
                    <Circle
                        r={badgeSize / 2 + 4}
                        fill={colors.primary}
                        opacity={0.2}
                    />

                    {/* Main badge circle */}
                    <Circle
                        r={badgeSize / 2}
                        fill={colors.surface}
                        stroke={colors.primary}
                        strokeWidth={3}
                    />

                    {/* Inner decoration circle */}
                    <Circle
                        r={badgeSize / 2 - 8}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth={1.5}
                        strokeDasharray="3, 2"
                        opacity={0.5}
                    />
                </G>
            </Svg>

            {/* Icon overlay */}
            <View style={[styles.iconContainer, { left: centerX - 14, top: curveHeight - 14 }]}>
                <MaterialCommunityIcons
                    name="flag-checkered"
                    size={28}
                    color={colors.primary}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        height: 60,
    },
    iconContainer: {
        position: 'absolute',
        width: 28,
        height: 28,
    },
});
