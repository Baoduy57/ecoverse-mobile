import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenBackground from '../../components/common/ScreenBackground';
import { QuizAttemptsSection, QuizListItemCard } from '../../components/quiz';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import { quizApi } from '../../services/api';
import { borderRadius, colors, spacing } from '../../theme';
import { StudentQuizSubmitResult, StudentQuizTemplate } from '../../types/quiz';
import { useAuthStore } from '../../store/authStore';

const PAGE_SIZE = 10;

export default function QuizListScreen() {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const { user } = useAuthStore();

  const [searchTitle, setSearchTitle] = useState('');
  const [quizzes, setQuizzes] = useState<StudentQuizTemplate[]>([]);
  const [attempts, setAttempts] = useState<StudentQuizSubmitResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: PAGE_SIZE,
    total_elements: 0,
    total_pages: 0,
    first: true,
    last: true,
  });

  const partnerId = useMemo(() => user?.partnerId ?? null, [user?.partnerId]);

  const fetchData = useCallback(
    async (title: string, withLoader = true) => {
      if (withLoader) {
        setIsLoading(true);
      }
      setErrorText(null);

      try {
        const availablePage = await quizApi.getAvailable({
          partnerId,
          title: title.trim() || null,
          page: 0,
          size: PAGE_SIZE,
        });

        setQuizzes(availablePage.content);
        setPageInfo({
          number: availablePage.number,
          size: availablePage.size,
          total_elements: availablePage.total_elements,
          total_pages: availablePage.total_pages,
          first: availablePage.first,
          last: availablePage.last,
        });

        quizApi
          .getMyAttempts(0, 5)
          .then(attemptsPage => {
            setAttempts(attemptsPage.content);
          })
          .catch(error => {
            console.warn('Failed to load quiz attempts:', error);
            setAttempts([]);
          });
      } catch (error) {
        setErrorText('Khong the tai danh sach quiz. Vui long thu lai.');
        setQuizzes([]);
        setAttempts([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsSearching(false);
      }
    },
    [partnerId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchData('', true);
    }, [fetchData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(searchTitle, false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetchData(searchTitle, false);
  };

  const handleOpenQuiz = (item: StudentQuizTemplate) => {
    navigation.navigate('QuizQuestion', {
      templateId: item.id,
      title: item.title,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Bài kiểm tra cho học sinh</Text>
            <Text style={styles.subtitle}>Danh sách bài kiểm tra và Lịch sử làm bài</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            value={searchTitle}
            onChangeText={setSearchTitle}
            placeholder="Tìm theo tiêu đề"
            placeholderTextColor={colors.text.secondary}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color={colors.text.white} />
            ) : (
              <MaterialCommunityIcons name="arrow-right" size={18} color={colors.text.white} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.paginationBox}>
          <Text style={styles.paginationText}>
            Trang {pageInfo.number + 1} • Size {pageInfo.size} • Tổng {pageInfo.total_elements}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          >
            {errorText ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>Danh sách bài kiểm tra</Text>
            {quizzes.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="notebook-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={styles.emptyText}>Không có bài kiểm tra nào</Text>
              </View>
            ) : (
              quizzes.map(item => (
                <QuizListItemCard key={item.id} item={item} onPress={handleOpenQuiz} />
              ))
            )}

            <Text style={styles.sectionTitle}>Lịch sử gần đây</Text>
            <QuizAttemptsSection attempts={attempts} />

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
  },
  emptyText: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerTextWrap: {
    flex: 1,
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  paginationBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  paginationText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
  },
  scrollView: {
    flex: 1,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.base,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  searchInput: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  title: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '900',
  },
});
