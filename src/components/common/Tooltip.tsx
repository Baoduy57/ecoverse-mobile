import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
}

const TOOLTIP_MAX_WIDTH = 250;
const TOOLTIP_ARROW_HEIGHT = 10;
const SCREEN_PADDING = 16;

export default function Tooltip({ children, content }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const triggerRef = useRef<View>(null);

    const showTooltip = () => {
        // Measure the position of the trigger element
        triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setPosition({ x: pageX, y: pageY, width, height });
            setVisible(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            // Auto-dismiss after 3 seconds
            timeoutRef.current = setTimeout(() => {
                hideTooltip();
            }, 3000);
        });
    };

    const hideTooltip = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
        });
    };

    const handlePress = () => {
        if (visible) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            hideTooltip();
        } else {
            showTooltip();
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Calculate tooltip position (centered below the trigger)
    const screenWidth = Dimensions.get('window').width;

    // Step 1: Center the tooltip horizontally relative to the trigger
    // Formula: triggerCenter - (tooltipWidth / 2)
    // - position.x is pageX (absolute screen coordinate from measure())
    // - position.width is the trigger element's width
    // - TOOLTIP_MAX_WIDTH is the maximum width of the tooltip (250px)
    let tooltipLeft = position.x + (position.width / 2) - (TOOLTIP_MAX_WIDTH / 2);

    // Step 2: Ensure tooltip doesn't go off-screen
    // Clamp the tooltip position to stay within screen boundaries with padding
    if (tooltipLeft < SCREEN_PADDING) {
        tooltipLeft = SCREEN_PADDING;
    } else if (tooltipLeft + TOOLTIP_MAX_WIDTH > screenWidth - SCREEN_PADDING) {
        tooltipLeft = screenWidth - TOOLTIP_MAX_WIDTH - SCREEN_PADDING;
    }

    // Step 3: Position tooltip below the trigger with a small gap
    // - position.y is pageY (absolute screen coordinate from measure())
    // - position.height is the trigger element's height
    // - Add 8px gap between trigger and arrow for visual clarity
    const tooltipTop = position.y + position.height + 8;

    return (
        <>
            <TouchableOpacity
                ref={triggerRef}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>

            {visible && (
                <Modal transparent visible={visible} animationType="none">
                    <TouchableWithoutFeedback onPress={hideTooltip}>
                        <View style={styles.overlay}>
                            <Animated.View
                                style={[
                                    styles.tooltipContainer,
                                    {
                                        opacity: fadeAnim,
                                        left: tooltipLeft,
                                        top: tooltipTop,
                                    }
                                ]}
                            >
                                <View style={styles.arrow} />
                                <View style={styles.tooltip}>
                                    <Text style={styles.tooltipText}>{content}</Text>
                                </View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    tooltipContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: TOOLTIP_ARROW_HEIGHT,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.primaryLight,
    },
    tooltip: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        maxWidth: TOOLTIP_MAX_WIDTH,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    tooltipText: {
        color: colors.text.white,
        fontSize: 13,
        lineHeight: 19,
        textAlign: 'center',
        fontWeight: '600',
    },
});
