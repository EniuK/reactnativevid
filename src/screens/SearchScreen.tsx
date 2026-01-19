/**
 * Search Screen
 * 
 * Advanced search interface with lazy loading and sorting capabilities.
 * 
 * Features:
 * - Search on Enter key press (no live search)
 * - Lazy loading: displays 10 results initially, loads more on demand
 * - Sort options: latest upload, oldest upload, most popular
 * - Shows all videos by default when no query is entered
 * - Result count display and search query tracking
 * - Optimized with useCallback to prevent unnecessary re-renders
 * 
 * @module SearchScreen
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { SearchInput } from '../components/SearchInput';
import { SearchVideoCard } from '../components/SearchVideoCard';
import { SortModal, SortOption } from '../components/SortModal';
import { NoInternetView } from '../components/NoInternetView';
import { useNetworkState } from '../hooks/useNetworkState';
import { searchVideos, getPopularVideos, SortOrder } from '../api/youtubeApi';
import { YouTubeVideo } from '../types/youtube';
import { RootStackParamList, MainTabParamList } from '../navigation/RootNavigator';

type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Search'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type SearchScreenRouteProp = RouteProp<MainTabParamList, 'Search'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
  route: SearchScreenRouteProp;
}

// Lazy loading configuration
const INITIAL_DISPLAY_COUNT = 10; // Number of videos to show initially
const LOAD_MORE_COUNT = 10; // Number of additional videos to load per "Show more" click

/**
 * Converts internal sort option to YouTube API sort order
 * @param {SortOption} sort - Internal sort option
 * @returns {SortOrder} YouTube API sort order
 */
const getSortOrder = (sort: SortOption): SortOrder => {
  switch (sort) {
    case 'date':
      return 'date';
    case 'dateDesc':
      return 'date';
    case 'viewCount':
      return 'viewCount';
    default:
      return 'relevance';
  }
};

/**
 * Gets human-readable label for sort option
 * @param {SortOption} sort - Sort option
 * @returns {string} Display label
 */
const getSortLabel = (sort: SortOption): string => {
  switch (sort) {
    case 'date':
      return 'Upload date: latest';
    case 'dateDesc':
      return 'Upload date: oldest';
    case 'viewCount':
      return 'Most popular';
    default:
      return 'Most popular';
  }
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  navigation,
  route,
}) => {
  const networkState = useNetworkState();
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<YouTubeVideo[]>([]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [sortOption, setSortOption] = useState<SortOption>('viewCount');
  const [showSortModal, setShowSortModal] = useState(false);
  const hasInitialLoadedRef = useRef<boolean>(false);
  const initialQuery = route.params?.query || '';

  /**
   * Loads popular videos sorted by view count.
   * Used as default content when no search query is provided.
   * Wrapped in useCallback to prevent unnecessary re-renders.
   */
  const loadPopularVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getPopularVideos(50);
      setAllVideos(results);
      setDisplayCount(INITIAL_DISPLAY_COUNT);
    } catch (err) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Performs video search with the given query and sort option.
   * Fetches up to 50 results and handles sorting (including reverse for oldest).
   * Resets display count to initial value after new search.
   * Wrapped in useCallback to prevent unnecessary re-renders.
   * 
   * @param {string} query - Search query string
   * @param {SortOption} sort - Sort option to apply
   */
  const performSearch = useCallback(async (query: string, sort: SortOption) => {
    if (!query.trim()) {
      loadPopularVideos();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const order = getSortOrder(sort);
      const results = await searchVideos(query, 50, order);
      let sortedResults = [...results];
      
      if (sort === 'dateDesc') {
        sortedResults = sortedResults.reverse();
      }
      
      setAllVideos(sortedResults);
      setDisplayCount(INITIAL_DISPLAY_COUNT);
    } catch (err) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [loadPopularVideos]);

  /**
   * Handles retry when internet connection is restored
   */
  const handleRetry = useCallback(() => {
    if (networkState.isConnected && searchQuery) {
      performSearch(searchQuery, sortOption);
    } else if (networkState.isConnected) {
      loadPopularVideos();
    }
  }, [networkState.isConnected, searchQuery, sortOption, performSearch, loadPopularVideos]);

  // Initial load: fetch videos once when component mounts or initialQuery changes
  useEffect(() => {
    // Prevent double loading on initial mount
    if (hasInitialLoadedRef.current && !initialQuery) {
      return;
    }

    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery, sortOption);
    } else {
      loadPopularVideos();
    }

    hasInitialLoadedRef.current = true;
    // Only run on mount and when initialQuery changes - NOT when sortOption changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Re-search with current query when sort option changes (only if already loaded)
  useEffect(() => {
    // Only re-search if we already have videos loaded (not on initial mount)
    if (hasInitialLoadedRef.current && searchQuery) {
      performSearch(searchQuery, sortOption);
    }
    // Only run when sortOption changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  useEffect(() => {
    const displayed = allVideos.slice(0, displayCount);
    setDisplayedVideos(displayed);
  }, [allVideos, displayCount]);

  /**
   * Handles search input submission (Enter key press).
   * Triggers search only when user explicitly submits the query.
   * 
   * @param {string} query - Search query from input
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query.trim(), sortOption);
    } else {
      loadPopularVideos();
    }
  }, [sortOption, performSearch, loadPopularVideos]);

  /**
   * Handles sort option change from sort modal.
   * Triggers new search with updated sort order.
   * 
   * @param {SortOption} sort - Selected sort option
   */
  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
  };

  /**
   * Loads additional videos for lazy loading.
   * Increments display count by LOAD_MORE_COUNT (10 videos).
   * Used by "Show more" button at the bottom of the list.
   */
  const handleShowMore = () => {
    const newCount = displayCount + LOAD_MORE_COUNT;
    setDisplayCount(newCount);
  };

  /**
   * Handles video card press - navigates to video detail screen.
   * Validates videoId before navigation to prevent errors.
   * 
   * @param {YouTubeVideo} video - Video object to navigate to
   */
  const handleVideoPress = (video: YouTubeVideo) => {
    if (video?.id?.videoId) {
      navigation.navigate('VideoDetail', { videoId: video.id.videoId });
    } else {
      console.error('Invalid video ID');
    }
  };

  const renderVideo = ({ item }: { item: YouTubeVideo }) => (
    <SearchVideoCard video={item} onPress={() => handleVideoPress(item)} />
  );

  const renderFooter = () => {
    if (displayedVideos.length < allVideos.length) {
      return (
        <View style={styles.showMoreContainer}>
          <TouchableOpacity
            onPress={handleShowMore}
            style={styles.showMoreButton}
            activeOpacity={0.7}
          >
            <Text style={styles.showMoreText}>
              Show more ({Math.min(LOAD_MORE_COUNT, allVideos.length - displayedVideos.length)})
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
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
            defaultValue={initialQuery}
            placeholder="Search videos..."
          />
          {(displayedVideos.length > 0 || loading) && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsText}>
                {allVideos.length} results <Text style={styles.boldText}>found for:</Text>
                {searchQuery ? <Text style={styles.boldText}> "{searchQuery}"</Text> : ''}
              </Text>
              <TouchableOpacity
                onPress={() => setShowSortModal(true)}
                style={styles.sortButton}
              >
                <Text style={styles.sortButtonText}>
                  Sort by: <Text style={styles.boldText}>{getSortLabel(sortOption)}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : displayedVideos.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No videos found. Try a different search.'
                : 'Search for videos to get started.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayedVideos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id?.videoId || `video-${Math.random()}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        )}
        <SortModal
          visible={showSortModal}
          selectedSort={sortOption}
          onClose={() => setShowSortModal(false)}
          onSelect={handleSortChange}
        />
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
    backgroundColor: '#fff',
    paddingBottom: 12,
  },
  resultsHeader: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    color: '#2B2D42',
    marginBottom: 8,
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    alignSelf: 'flex-end',
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    color: '#2B2D42',
  },
  boldText: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  showMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  showMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  showMoreText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ff3b30',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
});
