import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SearchInput } from '../components/SearchInput';
import { VideoCard } from '../components/VideoCard';
import { searchVideos } from '../api/youtubeApi';
import { YouTubeVideo } from '../types/youtube';
import { RootStackParamList } from '../navigation/RootNavigator';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
  route: SearchScreenRouteProp;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  navigation,
  route,
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialQuery = route.params?.query || '';

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchVideos(query, 20);
      setVideos(results);
    } catch (err) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    performSearch(query);
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    navigation.navigate('VideoDetail', { videoId: video.id.videoId });
  };

  const renderVideo = ({ item }: { item: YouTubeVideo }) => (
    <View style={styles.cardWrapper}>
      <VideoCard video={item} onPress={() => handleVideoPress(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchInput
        onSearch={handleSearch}
        defaultValue={initialQuery}
        placeholder="Search videos..."
      />
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : videos.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {initialQuery
              ? 'No videos found. Try a different search.'
              : 'Search for videos to get started.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item.id.videoId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 16,
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
