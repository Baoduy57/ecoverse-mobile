import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { studentApi } from '@/services/api/student';
import { useAuthStore } from '@/store/authStore';
import { WasteHistoryItem } from '@/types/wasteClassification';
import { colors } from '@/theme';
import ScreenBackground from '@/components/common/ScreenBackground';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import WasteDetailDialog, { BinMeta } from '@/components/ai/WasteDetailDialog';

type BinCode = WasteHistoryItem['correct_bin_code'];

const BIN_META: Record<BinCode, BinMeta> = {
  PLASTIC: {
    color: colors.history.bin.plastic.main,
    softColor: colors.history.bin.plastic.soft,
    gradient: colors.history.bin.plastic.gradient as unknown as [string, string],
    icon: 'recycle',
    label: 'Nhựa',
    emoji: '🧴',
    tip: 'Rửa sạch chai/lọ nhựa trước khi bỏ vào thùng để tái chế tốt hơn.',
  },
  PAPER: {
    color: colors.history.bin.paper.main,
    softColor: colors.history.bin.paper.soft,
    gradient: colors.history.bin.paper.gradient as unknown as [string, string],
    icon: 'file-document-outline',
    label: 'Giấy',
    emoji: '📄',
    tip: 'Giữ giấy khô, sạch để tăng khả năng tái chế và tránh lẫn tạp chất.',
  },
  ORGANIC: {
    color: colors.history.bin.organic.main,
    softColor: colors.history.bin.organic.soft,
    gradient: colors.history.bin.organic.gradient as unknown as [string, string],
    icon: 'leaf',
    label: 'Hữu cơ',
    emoji: '🍃',
    tip: 'Rác hữu cơ có thể ủ compost để làm phân bón cho cây trồng.',
  },
  OTHERS: {
    color: colors.history.bin.others.main,
    softColor: colors.history.bin.others.soft,
    gradient: colors.history.bin.others.gradient as unknown as [string, string],
    icon: 'delete',
    label: 'Khác',
    emoji: '🗑️',
    tip: 'Hạn chế dùng đồ một lần để giảm lượng rác khó xử lý.',
  },
};

export const getBinMeta = (code: BinCode): BinMeta => BIN_META[code] || BIN_META.OTHERS;

export const formatHistoryDate = (rawDate?: string) => {
  if (!rawDate) {
    return '';
  }

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  const hour = String(parsed.getHours()).padStart(2, '0');
  const minute = String(parsed.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} - ${hour}:${minute}`;
};

export default function AIWasteHistoryScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [items, setItems] = useState<WasteHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WasteHistoryItem | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const fetchHistory = async () => {
    if (!user?.id) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const response = await studentApi.getAIWasteItems(user.id);
      let data: WasteHistoryItem[] = [];
      
      if (response?.data) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      }
      
      // Đảm bảo logic luôn hiển thị lịch sử quét mới nhất lên trên
      data.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });

      setItems(data);
    } catch (error) {
      console.error('Lỗi tải lịch sử AI:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchHistory();
  };

  const summary = useMemo(() => {
    const result = {
      total: items.length,
      plastic: 0,
      paper: 0,
      organic: 0,
      others: 0,
    };

    items.forEach(item => {
      if (item.correct_bin_code === 'PLASTIC') {
        result.plastic += 1;
      } else if (item.correct_bin_code === 'PAPER') {
        result.paper += 1;
      } else if (item.correct_bin_code === 'ORGANIC') {
        result.organic += 1;
      } else {
        result.others += 1;
      }
    });

    return result;
  }, [items]);

  const openDetailDialog = (item: WasteHistoryItem) => {
    setSelectedItem(item);
    setIsDetailVisible(true);
  };

  const closeDetailDialog = () => {
    setIsDetailVisible(false);
    setSelectedItem(null);
  };

  const renderListHeader = () => (
    <>
      <LinearGradient
        colors={colors.history.heroGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTitleRow}>
          <MaterialCommunityIcons name="robot-happy-outline" size={28} color="#FFFFFF" />
          <Text style={styles.heroTitle}>Nhật ký EcoScan</Text>
        </View>
        <Text style={styles.heroSubtitle}>
          Mỗi lần quét là một điểm xanh cho hành tinh. Chạm vào từng mục để xem thông tin chi tiết.
        </Text>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryRow}
      >
        <View style={[styles.summaryCard, { backgroundColor: colors.history.summaryCard.total, borderColor: colors.history.summaryCard.totalBorder }]}>
          <MaterialCommunityIcons name="format-list-bulleted" size={28} color="#0F172A" style={styles.summaryIcon} />
          <Text style={styles.summaryValue}>{summary.total}</Text>
          <Text style={styles.summaryLabel}>Tổng lượt quét</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: BIN_META.PLASTIC.softColor, borderColor: colors.history.summaryCard.totalBorder }]}>
          <MaterialCommunityIcons name={BIN_META.PLASTIC.icon as any} size={28} color={BIN_META.PLASTIC.color} style={styles.summaryIcon} />
          <Text style={styles.summaryValue}>{summary.plastic}</Text>
          <Text style={styles.summaryLabel}>Nhựa</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: BIN_META.PAPER.softColor, borderColor: colors.history.summaryCard.totalBorder }]}>
          <MaterialCommunityIcons name={BIN_META.PAPER.icon as any} size={28} color={BIN_META.PAPER.color} style={styles.summaryIcon} />
          <Text style={styles.summaryValue}>{summary.paper}</Text>
          <Text style={styles.summaryLabel}>Giấy</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: BIN_META.ORGANIC.softColor, borderColor: colors.history.summaryCard.totalBorder }]}>
          <MaterialCommunityIcons name={BIN_META.ORGANIC.icon as any} size={28} color={BIN_META.ORGANIC.color} style={styles.summaryIcon} />
          <Text style={styles.summaryValue}>{summary.organic}</Text>
          <Text style={styles.summaryLabel}>Hữu cơ</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: BIN_META.OTHERS.softColor, borderColor: colors.history.summaryCard.totalBorder }]}>
          <MaterialCommunityIcons name={BIN_META.OTHERS.icon as any} size={28} color={BIN_META.OTHERS.color} style={styles.summaryIcon} />
          <Text style={styles.summaryValue}>{summary.others}</Text>
          <Text style={styles.summaryLabel}>Khác</Text>
        </View>
      </ScrollView>
    </>
  );

  const renderItem = ({ item }: { item: WasteHistoryItem }) => {
    const binMeta = getBinMeta(item.correct_bin_code);
    const createdAt = formatHistoryDate(item.created_at);

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        style={styles.cardPressable}
        onPress={() => openDetailDialog(item)}
      >
        <LinearGradient
          colors={binMeta.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={[styles.imageWrap, { borderColor: binMeta.color }]}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.image} />
            ) : (
              <View style={styles.imageFallback}>
                <MaterialCommunityIcons name="image-off-outline" size={22} color="#9CA3AF" />
              </View>
            )}
            <View style={[styles.iconBadge, { backgroundColor: binMeta.color }]}>
              <MaterialCommunityIcons name={binMeta.icon as any} size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <MaterialCommunityIcons name="star-four-points" size={16} color={binMeta.color} />
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {item.description || 'Chưa có mô tả chi tiết cho vật này.'}
            </Text>

            <View style={styles.footer}>
              <View style={[styles.badge, { backgroundColor: binMeta.softColor }]}>
                <MaterialCommunityIcons
                  name={binMeta.icon as any}
                  size={14}
                  color={binMeta.color}
                />
                <Text style={[styles.badgeText, { color: binMeta.color }]}>{binMeta.label}</Text>
              </View>
              <Text style={styles.dateText}>{createdAt}</Text>
            </View>

            <Text style={[styles.tapHint, { color: binMeta.color }]}>Nhấn để xem chi tiết</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const selectedMeta = selectedItem ? getBinMeta(selectedItem.correct_bin_code) : null;

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            icon="arrow-left"
            compact
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}
          >
            Quay lại
          </Button>
          <Text style={styles.headerTitle}>Lịch sử quét AI</Text>
          <View style={styles.placeholder} />
        </View>

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải lịch sử quét...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centerContainer}>
            <LinearGradient
              colors={colors.history.emptyIconGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emptyIconWrap}
            >
              <MaterialCommunityIcons name="history" size={64} color="#0288D1" />
            </LinearGradient>
            <Text style={styles.emptyText}>Chưa có lịch sử quét nào</Text>
            <Text style={styles.emptySubText}>
              Hãy quét vật đầu tiên để bắt đầu bộ sưu tập xanh của bạn!
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderListHeader}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}

        <WasteDetailDialog
          visible={isDetailVisible}
          onDismiss={closeDetailDialog}
          selectedItem={selectedItem}
          selectedMeta={selectedMeta}
          formatDate={formatHistoryDate}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -8,
  },
  backButtonLabel: {
    color: colors.text.primary,
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  placeholder: {
    width: 80,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptyIconWrap: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 280,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  heroSubtitle: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
  },
  summaryRow: {
    paddingBottom: 10,
    gap: 10,
  },
  summaryCard: {
    minWidth: 120,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  summaryIcon: {
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  cardPressable: {
    marginBottom: 14,
  },
  card: {
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
    padding: 10,
  },
  imageWrap: {
    width: 106,
    height: 106,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  iconBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 2,
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 17,
    marginVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    flexShrink: 1,
    textAlign: 'right',
  },
  tapHint: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});
