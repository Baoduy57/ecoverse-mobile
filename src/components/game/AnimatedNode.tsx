import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface AnimatedNodeProps {
    children: React.ReactNode;
    index: number;
    isNew: boolean;
}

const AnimatedNode = React.memo(({ children, index, isNew }: AnimatedNodeProps) => {
    const anim = useRef(new Animated.Value(isNew ? 0 : 1)).current;

    useEffect(() => {
        if (isNew) {
            Animated.spring(anim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                delay: (index % 10) * 80,
                useNativeDriver: true,
            }).start();
        }
    }, [isNew, anim, index]);

    return (
        <Animated.View style={{
            opacity: anim,
            transform: [
                { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
            ]
        }}>
            {children}
        </Animated.View>
    );
});

export default AnimatedNode;
