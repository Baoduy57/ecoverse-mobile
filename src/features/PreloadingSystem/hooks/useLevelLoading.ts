import { useState, useRef, useEffect } from 'react';
import { Animated, LayoutAnimation } from 'react-native';
import { ROADMAP_CONSTANTS } from '@constants/roadmap';
import { generateLevels } from '@utils/roadmapUtils';
import type { Level } from '@/types/game';

interface UseLevelLoadingProps {
    initialLevels?: Level[];
    allAvailableLevels?: Level[];
    initialCount?: number;
    batchSize?: number;
    maxLevels?: number;
    onLoadStart?: () => void;
    onLoadEnd?: (newLevels: Level[]) => void;
}

export const useLevelLoading = ({
    initialLevels,
    allAvailableLevels,
    initialCount = 10,
    batchSize = 10,
    maxLevels = 30,
    onLoadStart,
    onLoadEnd,
}: UseLevelLoadingProps = {}) => {
    // Determine effective max levels
    const effectiveMaxLevels = allAvailableLevels ? allAvailableLevels.length : maxLevels;

    // Initialize levels: if initialLevels given use it, otherwise take from allAvailableLevels or generate
    const getInitialLevels = () => {
        if (initialLevels && initialLevels.length > 0) return initialLevels;
        if (allAvailableLevels && allAvailableLevels.length > 0) {
            return allAvailableLevels.slice(0, initialCount);
        }
        return generateLevels(0, initialCount);
    };

    const [levels, setLevels] = useState<Level[]>(getInitialLevels);
    const [lastLevelsCount, setLastLevelsCount] = useState(levels.length);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isPreloaderCompleting, setIsPreloaderCompleting] = useState(false);

    const preloaderOpacity = useRef(new Animated.Value(1)).current;

    // Sync state when real availability data changes (e.g. after API fetch)
    useEffect(() => {
        if (allAvailableLevels && allAvailableLevels.length > 0) {
            const initial = allAvailableLevels.slice(0, initialCount);
            setLevels(initial);
            setLastLevelsCount(initial.length);
        }
    }, [allAvailableLevels, initialCount]);

    const loadMoreLevels = () => {
        if (levels.length >= effectiveMaxLevels || isLoadingMore) return;

        setIsLoadingMore(true);
        setIsPreloaderCompleting(true);
        if (onLoadStart) onLoadStart();
    };

    const handlePreloaderCycleEnd = () => {
        Animated.timing(preloaderOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

            const remainingToMax = effectiveMaxLevels - levels.length;
            const countToFetch = Math.min(batchSize, remainingToMax);

            let nextLevels: Level[] = [];
            if (countToFetch > 0) {
                if (allAvailableLevels && allAvailableLevels.length > levels.length) {
                    nextLevels = allAvailableLevels.slice(levels.length, levels.length + countToFetch);
                } else {
                    nextLevels = generateLevels(levels.length, countToFetch);
                }
            }

            setLastLevelsCount(levels.length);

            const updatedLevels = [...levels, ...nextLevels];
            setLevels(updatedLevels);
            setIsLoadingMore(false);
            setIsPreloaderCompleting(false);

            // Reset opacity for next load
            preloaderOpacity.setValue(1);

            if (onLoadEnd) onLoadEnd(nextLevels);
        });
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 180;

        if (isCloseToBottom && !isLoadingMore && levels.length < effectiveMaxLevels) {
            loadMoreLevels();
        }
    };

    const resetLevels = () => {
        const freshLevels = allAvailableLevels
            ? allAvailableLevels.slice(0, initialCount)
            : generateLevels(0, initialCount);
        setLevels(freshLevels);
        setLastLevelsCount(freshLevels.length);
        setIsLoadingMore(false);
        setIsPreloaderCompleting(false);
        preloaderOpacity.setValue(1);
    };

    return {
        levels,
        setLevels,
        lastLevelsCount,
        isLoadingMore,
        isPreloaderCompleting,
        setIsPreloaderCompleting,
        preloaderOpacity,
        handlePreloaderCycleEnd,
        loadMoreLevels,
        handleScroll,
        resetLevels,
    };
};
