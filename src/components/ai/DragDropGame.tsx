import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Image, PanResponder, Animated, Platform } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WasteBin from './WasteBin';
import { WasteType, WASTE_TYPES } from '@/types/wasteClassification';
import { checkWasteClassification } from '@/services/api/vision';
import { colors } from '@/theme';

type BinLayout = { x: number; y: number; width: number; height: number };

interface DragDropGameProps {
  imageUri: string;
  correctWasteType: WasteType;
  displayName?: string;
  onCorrect: (feedback: string) => void;
  onRetry: () => void;
}

export default function DragDropGame({
  imageUri,
  correctWasteType,
  displayName: displayNameProp,
  onCorrect,
  onRetry,
}: DragDropGameProps) {
  const objectName =
    displayNameProp ||
    correctWasteType.name.charAt(0).toUpperCase() + correctWasteType.name.slice(1).toLowerCase();
  const [pan] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedBin, setHighlightedBin] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const binLayoutsRef = useRef<Record<string, BinLayout>>({});
  const binRefs = useRef<Record<string, View | null>>({});
  const lastTouchRef = useRef({ pageX: 0, pageY: 0 });

  const updateBinLayout = useCallback((binId: string) => {
    const bin = binRefs.current[binId];
    if (bin) {
      bin.measureInWindow((x, y, width, height) => {
        binLayoutsRef.current[binId] = { x, y, width, height };
      });
    }
  }, []);

  const findBinAtPosition = useCallback((pageX: number, pageY: number): string | null => {
    const layouts = binLayoutsRef.current;
    const padding = 25;
    for (const binId of Object.keys(layouts)) {
      const bin = layouts[binId];
      if (!bin) continue;
      if (
        pageX >= bin.x - padding &&
        pageX <= bin.x + bin.width + padding &&
        pageY >= bin.y - padding &&
        pageY <= bin.y + bin.height + padding
      ) {
        return binId;
      }
    }
    return null;
  }, []);

  if (!correctWasteType || !imageUri) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={colors.status.error} />
          <Text variant="bodyLarge" style={styles.errorText}>
            Dữ liệu không hợp lệ
          </Text>
          <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
            Thử lại
          </Button>
        </View>
      </View>
    );
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      WASTE_TYPES.forEach(t => updateBinLayout(t.id));
      setIsDragging(true);
      pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      })(evt, gestureState);

      const touch = evt.nativeEvent.touches?.[0];
      if (touch) {
        lastTouchRef.current = { pageX: touch.pageX, pageY: touch.pageY };
        const hovered = findBinAtPosition(touch.pageX, touch.pageY);
        setHighlightedBin(hovered);
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
      pan.flattenOffset();

      const { pageX, pageY } = lastTouchRef.current;
      const droppedBinId = findBinAtPosition(pageX, pageY);
      setHighlightedBin(null);

      if (droppedBinId) {
        const selectedType = WASTE_TYPES.find(t => t.id === droppedBinId);
        if (selectedType) {
          const result = checkWasteClassification(correctWasteType, selectedType);
          setIsCorrectAnswer(result.isCorrect);
          setShowFeedback(true);

          if (result.isCorrect) {
            setSuccessFeedback(result.feedback);
          } else {
            setSuccessFeedback(null);
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 80,
              friction: 10,
            }).start();
          }
        }
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          tension: 80,
          friction: 10,
        }).start();
      }
    },
  });

  const handleBinLayout = useCallback(
    (binId: string) => () => {
      setTimeout(() => updateBinLayout(binId), 100);
    },
    [updateBinLayout]
  );

  const handleTryAgain = () => {
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setSuccessFeedback(null);
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    const feedbackToUse = successFeedback || '';
    onCorrect(feedbackToUse);
  };

  return (
    <View style={styles.container}>
      {/* Card ảnh phân tích - theo mẫu: pill label + ảnh + nút ĐÃ NHẬN DIỆN */}
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.draggableWrapper,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: isDragging ? 1.1 : 1 },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Surface
            style={[styles.objectCard, isDragging && styles.objectCardDragging]}
            elevation={isDragging ? 5 : 4}
          >
            {/* Pill label: tên vật + checkmark */}
            <View style={[styles.objectLabel, { backgroundColor: correctWasteType.color + '25' }]}>
              <Text
                style={[styles.objectLabelText, { color: correctWasteType.color }]}
                numberOfLines={1}
              >
                {objectName.toUpperCase()}
              </Text>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.status.success} />
            </View>
            {/* Ảnh vật được chụp */}
            <Image source={{ uri: imageUri }} style={styles.objectImage} />
            {/* Nút xác nhận ĐÃ NHẬN DIỆN */}
            <View style={[styles.confirmBadge, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
              <Text style={styles.confirmBadgeText}>ĐÃ NHẬN DIỆN!</Text>
            </View>
          </Surface>
        </Animated.View>
      </View>

      {/* Banner hướng dẫn */}
      <View style={styles.instructionBanner}>
        <MaterialCommunityIcons name="star-four-points" size={20} color={colors.accent} />
        <Text style={styles.instructionBannerText}>
          Tuyệt quá! Hãy kéo {objectName} vào đúng thùng rác nhé!
        </Text>
      </View>

      {/* 4 thùng rác - chỉ ký hiệu, to hơn */}
      <View style={styles.binsContainer} collapsable={false}>
        {WASTE_TYPES.map(wasteType => (
          <View
            key={wasteType.id}
            ref={ref => {
              binRefs.current[wasteType.id] = ref;
            }}
            onLayout={handleBinLayout(wasteType.id)}
            style={styles.binWrapper}
            collapsable={false}
          >
            <WasteBin wasteType={wasteType} isHighlighted={highlightedBin === wasteType.id} />
          </View>
        ))}
      </View>

      {/* Feedback modal - nền đặc, chữ rõ nét, dễ đọc */}
      {showFeedback && (
        <View style={styles.feedbackOverlay}>
          <View
            style={[
              styles.feedbackCard,
              isCorrectAnswer ? styles.feedbackSuccess : styles.feedbackError,
            ]}
          >
            <View style={styles.feedbackIconWrapper}>
              <MaterialCommunityIcons
                name={isCorrectAnswer ? 'check-circle' : 'close-circle'}
                size={64}
                color={isCorrectAnswer ? colors.status.success : colors.status.error}
              />
            </View>
            <Text
              style={[
                styles.feedbackTitle,
                isCorrectAnswer ? styles.feedbackTitleSuccess : styles.feedbackTitleError,
              ]}
            >
              {isCorrectAnswer ? 'ĐÃ NHẬN DIỆN!' : 'CHƯA ĐÚNG!'}
            </Text>

            {isCorrectAnswer && (
              <View style={styles.feedbackContent}>
                <View style={styles.feedbackSection}>
                  <MaterialCommunityIcons
                    name="information"
                    size={20}
                    color={colors.status.success}
                  />
                  <Text style={styles.feedbackSectionTitle}>Mô tả</Text>
                </View>
                <Text style={styles.feedbackDescription}>{correctWasteType.description}</Text>
                <View style={styles.feedbackSection}>
                  <MaterialCommunityIcons name="recycle" size={20} color={colors.status.success} />
                  <Text style={styles.feedbackSectionTitle}>Hướng dẫn xử lý</Text>
                </View>
                <Text style={styles.feedbackRecycling}>{correctWasteType.recyclingInfo}</Text>
                <Button
                  mode="contained"
                  onPress={handleContinue}
                  style={styles.feedbackContinueButton}
                  buttonColor={colors.primary}
                >
                  Đã hiểu, tiếp tục
                </Button>
              </View>
            )}

            {!isCorrectAnswer && (
              <>
                <Text style={styles.feedbackHint}>Hãy thử chọn thùng rác khác nhé!</Text>
                <Button
                  mode="contained"
                  onPress={handleTryAgain}
                  style={styles.feedbackRetryButton}
                  buttonColor={colors.primary}
                >
                  Thử lại
                </Button>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  binWrapper: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  binsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  confirmBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  confirmBadgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  draggableWrapper: {
    width: 200,
  },
  errorCard: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 20,
    marginTop: 16,
    textAlign: 'center',
  },
  feedbackCard: {
    alignItems: 'center',
    borderRadius: 24,
    maxWidth: 360,
    padding: 28,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  feedbackContent: {
    gap: 12,
    width: '100%',
  },
  feedbackContinueButton: {
    alignSelf: 'stretch',
    borderRadius: 16,
    marginTop: 20,
  },
  feedbackDescription: {
    color: colors.text.primary,
    fontSize: 15,
    lineHeight: 24,
  },
  feedbackError: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.status.error,
    borderWidth: 3,
  },
  feedbackHint: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  feedbackIconWrapper: {
    marginBottom: 16,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  feedbackRecycling: {
    color: colors.text.primary,
    fontSize: 15,
    lineHeight: 24,
  },
  feedbackRetryButton: {
    borderRadius: 16,
  },
  feedbackSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  feedbackSectionTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackSuccess: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.status.success,
    borderWidth: 3,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  feedbackTitleError: {
    color: colors.status.error,
  },
  feedbackTitleSuccess: {
    color: colors.status.success,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 260,
  },
  instructionBanner: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  instructionBannerText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  objectCard: {
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    width: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  objectCardDragging: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  objectImage: {
    backgroundColor: colors.background,
    height: 140,
    width: 200,
  },
  objectLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  objectLabelText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  retryButton: {
    borderRadius: 16,
  },
});
