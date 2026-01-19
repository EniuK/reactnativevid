/**
 * Home Screen
 * 
 * Main screen displaying categorized video lists and search functionality.
 * 
 * Features:
 * - Four horizontal video lists by category (React Native, React, TypeScript, JavaScript)
 * - Search input in header for quick navigation to search screen
 * - Settings icon for accessing user preferences
 * - "Show more" functionality for each category
 * - Parallel video fetching for all categories
 * 
 * @module HomeScreen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { SearchInput } from '../components/SearchInput';
import { CategoryRow } from '../components/CategoryRow';
import { NoInternetView } from '../components/NoInternetView';
import { SettingsIcon } from '../components/icons/SvgIcon';
import { useNetworkState } from '../hooks/useNetworkState';
import { searchVideos } from '../api/youtubeApi';
import { YouTubeVideo } from '../types/youtube';
import { CATEGORIES, Category } from '../constants/categories';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MainTabParamList } from '../navigation/RootNavigator';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const networkState = useNetworkState();
  const [categoryVideos, setCategoryVideos] = useState<
    Record<Category, YouTubeVideo[]>
  >({
    'React Native': [],
    React: [],
    TypeScript: [],
    JavaScript: [],
  });
  const [loading, setLoading] = useState<Record<Category, boolean>>({
    'React Native': true,
    React: true,
    TypeScript: true,
    JavaScript: true,
  });

  /**
   * Handles retry when internet connection is restored
   */
  const handleRetry = () => {
    if (networkState.isConnected) {
      // Re-fetch videos if connection is restored
      const fetchCategoryVideos = async () => {
        const promises = CATEGORIES.map(async (category) => {
          try {
            setLoading((prev) => ({ ...prev, [category]: true }));
            const videos = await searchVideos(category, 10);
            setCategoryVideos((prev) => ({ ...prev, [category]: videos }));
          } catch (error) {
            console.error(`Error fetching ${category} videos:`, error);
          } finally {
            setLoading((prev) => ({ ...prev, [category]: false }));
          }
        });
        await Promise.all(promises);
      };
      fetchCategoryVideos();
    }
  };

  // Fetch videos for all categories in parallel on component mount
  useEffect(() => {
    const fetchCategoryVideos = async () => {
      const promises = CATEGORIES.map(async (category) => {
        try {
          const videos = await searchVideos(category, 10);
          setCategoryVideos((prev) => ({ ...prev, [category]: videos }));
        } catch (error) {
          console.error(`Error fetching ${category} videos:`, error);
        } finally {
          setLoading((prev) => ({ ...prev, [category]: false }));
        }
      });
      await Promise.all(promises);
    };

    fetchCategoryVideos();
  }, []);

  /**
   * Handles search input submission - navigates to search screen with query.
   * 
   * @param {string} query - Search query from input
   */
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigation.navigate('Search', { query: query.trim() });
    }
  };

  /**
   * Handles video card press - navigates to video detail screen.
   * Validates videoId before navigation.
   * 
   * @param {YouTubeVideo} video - Video object to navigate to
   */
  const handleVideoPress = (video: YouTubeVideo) => {
    if (video?.id?.videoId) {
      navigation.navigate('VideoDetail', { videoId: video.id.videoId });
    }
  };

  /**
   * Handles "Show more" button press - navigates to search screen with category as query.
   * 
   * @param {Category} category - Category name to search for
   */
  const handleShowMore = (category: Category) => {
    navigation.navigate('Search', { query: category });
  };

  /**
   * Handles settings icon press - navigates to settings screen.
   */
  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  // Show no internet view if not connected
  if (networkState.isConnected === false) {
    return <NoInternetView onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchInput
            onSearch={handleSearch}
            placeholder="Search videos"
            compact
          />
          <TouchableOpacity
            onPress={handleSettingsPress}
            style={styles.settingsButton}
          >
            <SettingsIcon width={24} height={24} color="#2B2D42" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CATEGORIES.map((category) => (
            <CategoryRow
              key={category}
              title={category}
              videos={categoryVideos[category]}
              loading={loading[category]}
              onVideoPress={handleVideoPress}
              onShowMore={handleShowMore}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#fff',
  },
  settingsButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
