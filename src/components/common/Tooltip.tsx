import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
}

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
    const tooltipLeft = position.x + position.width / 2;
    const tooltipTop = position.y + position.height + 8; // 8px gap below trigger

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
        transform: [{ translateX: -125 }], // Center the tooltip (maxWidth 250 / 2)
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.text.primary,
    },
    tooltip: {
        backgroundColor: colors.text.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        maxWidth: 250,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    tooltipText: {
        color: colors.surface,
        fontSize: 13,
        lineHeight: 19,
        textAlign: 'center',
        fontWeight: '600',
    },
});
