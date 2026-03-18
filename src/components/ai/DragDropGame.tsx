import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WasteBin from './WasteBin';
import { WasteType, WASTE_TYPES } from '@/types/wasteClassification';
import { checkWasteClassification } from '@/services/api/vision';
import { colors } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // ─── Smooth drag: pan in useRef + pan.setValue (no Animated.event/setOffset) ───
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const bounceLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [highlightedBin, setHighlightedBin] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const binLayoutsRef = useRef<Record<string, BinLayout>>({});
  const binRefs = useRef<Record<string, View | null>>({});
  const lastTouchRef = useRef({ pageX: 0, pageY: 0 });

  // Refs to avoid stale closures inside stable panResponder
  const correctWasteTypeRef = useRef(correctWasteType);
  correctWasteTypeRef.current = correctWasteType;

  // ─── Bounce hint animation ───────────────────────────────────────────
  const startBounce = useCallback(() => {
    bounceLoopRef.current?.stop();
    bounceLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -10, duration: 700, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    bounceLoopRef.current.start();
  }, [bounceAnim]);

  useEffect(() => {
    startBounce();
    return () => bounceLoopRef.current?.stop();
  }, [startBounce]);

  // ─── Layout helpers ──────────────────────────────────────────────────
  const updateBinLayout = useCallback((binId: string) => {
    const bin = binRefs.current[binId];
    if (bin) {
      bin.measureInWindow((x, y, width, height) => {
        binLayoutsRef.current[binId] = { x, y, width, height };
      });
    }
  }, []);

  // Stored in a ref so the stable panResponder can call the latest version
  const findBinRef = useRef<(px: number, py: number) => string | null>(() => null);
  findBinRef.current = (pageX: number, pageY: number): string | null => {
    const padding = 22;
    for (const binId of Object.keys(binLayoutsRef.current)) {
      const bin = binLayoutsRef.current[binId];
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
  };
  const updateBinLayoutRef = useRef(updateBinLayout);
  updateBinLayoutRef.current = updateBinLayout;

  // ─── PanResponder in useRef – created once, no recreation on render ──
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        WASTE_TYPES.forEach(t => updateBinLayoutRef.current(t.id));
        setIsDragging(true);
        bounceLoopRef.current?.stop();
        bounceAnim.setValue(0);
        Animated.timing(scaleAnim, { toValue: 1.12, duration: 120, useNativeDriver: true }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        // Direct setValue = zero bridge overhead = silky 60fps drag
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        const touch = evt.nativeEvent.touches?.[0];
        if (touch) {
          lastTouchRef.current = { pageX: touch.pageX, pageY: touch.pageY };
          setHighlightedBin(findBinRef.current(touch.pageX, touch.pageY));
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }).start();

        const { pageX, pageY } = lastTouchRef.current;
        const droppedBinId = findBinRef.current(pageX, pageY);
        setHighlightedBin(null);

        if (droppedBinId) {
          const selectedType = WASTE_TYPES.find(t => t.id === droppedBinId);
          if (selectedType) {
            const result = checkWasteClassification(correctWasteTypeRef.current, selectedType);
            setIsCorrectAnswer(result.isCorrect);
            setShowFeedback(true);
            if (result.isCorrect) {
              setSuccessFeedback(result.feedback);
            } else {
              setSuccessFeedback(null);
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
                tension: 80,
                friction: 10,
              }).start();
            }
          }
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 80,
            friction: 10,
          }).start(() => {
            // restart bounce after snap-back
            const loop = Animated.loop(
              Animated.sequence([
                Animated.timing(bounceAnim, { toValue: -10, duration: 700, useNativeDriver: true }),
                Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
              ])
            );
            bounceLoopRef.current = loop;
            loop.start();
          });
        }
      },
    })
  ).current;

  const handleBinLayout = useCallback(
    (binId: string) => () => {
      setTimeout(() => updateBinLayout(binId), 120);
    },
    [updateBinLayout]
  );

  const handleTryAgain = () => {
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    setSuccessFeedback(null);
    pan.setValue({ x: 0, y: 0 });
    startBounce();
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setIsCorrectAnswer(false);
    onCorrect(successFeedback || '');
  };

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

  return (
    <View style={styles.container}>
      {/* ── Draggable item card ──────────────────────────────────────── */}
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.draggableWrapper,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scaleAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={[styles.objectCardShadow, isDragging && { shadowColor: correctWasteType.color }]}
          >
            {/* Gradient label strip */}
            <LinearGradient
              colors={[correctWasteType.color, correctWasteType.color + 'BB']}
              style={styles.objectLabel}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialCommunityIcons
                name={correctWasteType.icon as any}
                size={15}
                color="#FFFFFF"
              />
              <Text style={styles.objectLabelText} numberOfLines={1}>
                {objectName.toUpperCase()}
              </Text>
              <MaterialCommunityIcons name="check-circle" size={15} color="#FFFFFF" />
            </LinearGradient>

            {/* Photo */}
            <Image source={{ uri: imageUri }} style={styles.objectImage} />

            {/* Drag hint row - always use bounceAnim (setValue(0) on drag start keeps it at 0) */}
            <LinearGradient
              colors={[correctWasteType.color + '22', correctWasteType.color + '08']}
              style={styles.dragHintRow}
            >
              <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
                <MaterialCommunityIcons
                  name="arrow-down-bold"
                  size={17}
                  color={correctWasteType.color}
                />
              </Animated.View>
              <Text style={[styles.dragHintText, { color: correctWasteType.color }]}>
                {isDragging ? 'Thả vào thùng rác!' : 'Kéo vào thùng rác!'}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>
      </View>

      {/* ── Instruction banner ───────────────────────────────────────── */}
      <LinearGradient
        colors={['#FFF9C4', '#FFF3E0']}
        style={styles.instructionBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.instructionEmoji}>🌟</Text>
        <Text style={styles.instructionBannerText}>
          Hãy kéo{' '}
          <Text style={[styles.instructionHighlight, { color: correctWasteType.color }]}>
            {objectName}
          </Text>{' '}
          vào đúng thùng rác!
        </Text>
      </LinearGradient>

      {/* ── Waste bins ───────────────────────────────────────────────── */}
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

      {/* ── Feedback overlay ─────────────────────────────────────────── */}
      {showFeedback && (
        <View style={styles.feedbackOverlay}>
          <View style={[styles.feedbackCard, isCorrectAnswer ? styles.fcSuccess : styles.fcError]}>
            {/* Background gradient */}
            <LinearGradient
              colors={
                isCorrectAnswer
                  ? ['#E8F5E9', '#F1F8E9', '#FFFFFF']
                  : ['#FFEBEE', '#FFF8F8', '#FFFFFF']
              }
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Icon circle */}
            <View
              style={[
                styles.feedbackIconCircle,
                {
                  backgroundColor: isCorrectAnswer
                    ? colors.status.success + '25'
                    : colors.status.error + '25',
                },
              ]}
            >
              <MaterialCommunityIcons
                name={isCorrectAnswer ? 'check-circle' : 'close-circle'}
                size={68}
                color={isCorrectAnswer ? colors.status.success : colors.status.error}
              />
            </View>

            <Text
              style={[
                styles.feedbackTitle,
                { color: isCorrectAnswer ? colors.status.success : colors.status.error },
              ]}
            >
              {isCorrectAnswer ? '🎉 CHÍNH XÁC!' : '❌ CHƯA ĐÚNG!'}
            </Text>

            {isCorrectAnswer && (
              <View style={styles.feedbackContent}>
                {/* Bin badge */}
                <View
                  style={[
                    styles.feedbackBinBadge,
                    { backgroundColor: correctWasteType.color + '20' },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={correctWasteType.icon as any}
                    size={17}
                    color={correctWasteType.color}
                  />
                  <Text style={[styles.feedbackBinName, { color: correctWasteType.color }]}>
                    {correctWasteType.name}
                  </Text>
                </View>

                <View style={styles.feedbackSection}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.feedbackSectionTitle}>Mô tả</Text>
                </View>
                <Text style={styles.feedbackBody}>{correctWasteType.description}</Text>

                <View style={[styles.feedbackDivider, { backgroundColor: colors.border }]} />

                <View style={styles.feedbackSection}>
                  <MaterialCommunityIcons name="recycle" size={16} color={colors.accentBlue} />
                  <Text style={styles.feedbackSectionTitle}>Cách xử lý</Text>
                </View>
                <Text style={styles.feedbackBody}>{correctWasteType.recyclingInfo}</Text>

                <Button
                  mode="contained"
                  onPress={handleContinue}
                  style={styles.feedbackContinueBtn}
                  buttonColor={colors.primary}
                  contentStyle={styles.feedbackBtnContent}
                >
                  ✅ Đã hiểu, tiếp tục!
                </Button>
              </View>
            )}

            {!isCorrectAnswer && (
              <>
                <Text style={styles.feedbackHint}>💡 Hãy thử thùng rác khác nhé!</Text>
                <Button
                  mode="contained"
                  onPress={handleTryAgain}
                  style={styles.feedbackRetryBtn}
                  buttonColor={colors.secondary}
                  contentStyle={styles.feedbackBtnContent}
                >
                  🔄 Thử lại
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
  // ── Layout ────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 230,
  },
  draggableWrapper: {
    width: 210,
  },

  // ── Object card ───────────────────────────────────────────────────────
  objectCardShadow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    width: 210,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
      },
      android: { elevation: 8 },
    }),
  },
  objectLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  objectLabelText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  objectImage: {
    backgroundColor: '#F5F5F5',
    height: 145,
    width: 210,
  },
  dragHintRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dragHintText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Instruction banner ────────────────────────────────────────────────
  instructionBanner: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  instructionEmoji: { fontSize: 20 },
  instructionBannerText: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  instructionHighlight: {
    fontWeight: '800',
  },

  // ── Bins ──────────────────────────────────────────────────────────────
  binsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  binWrapper: {
    alignItems: 'center',
    flex: 1,
  },

  // ── Feedback overlay ──────────────────────────────────────────────────
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 16,
  },
  feedbackCard: {
    alignItems: 'center',
    borderRadius: 28,
    maxWidth: 380,
    overflow: 'hidden',
    padding: 28,
    width: '95%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 18 },
    }),
  },
  fcSuccess: { backgroundColor: '#FFFFFF', borderColor: colors.status.success, borderWidth: 3 },
  fcError: { backgroundColor: '#FFFFFF', borderColor: colors.status.error, borderWidth: 3 },
  feedbackIconCircle: {
    alignItems: 'center',
    borderRadius: 60,
    height: 108,
    justifyContent: 'center',
    marginBottom: 10,
    width: 108,
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 14,
    textAlign: 'center',
  },
  feedbackContent: {
    gap: 10,
    width: '100%',
  },
  feedbackBinBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feedbackBinName: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  feedbackSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  feedbackSectionTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  feedbackBody: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 2,
  },
  feedbackDivider: {
    height: 1,
    marginVertical: 2,
    width: '100%',
  },
  feedbackHint: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    marginTop: 4,
    textAlign: 'center',
  },
  feedbackContinueBtn: {
    alignSelf: 'stretch',
    borderRadius: 16,
    marginTop: 14,
  },
  feedbackRetryBtn: {
    borderRadius: 16,
    width: '100%',
  },
  feedbackBtnContent: {
    paddingVertical: 6,
  },

  // ── Error state ───────────────────────────────────────────────────────
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
  retryButton: { borderRadius: 16 },
});
