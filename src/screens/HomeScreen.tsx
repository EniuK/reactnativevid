import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchInput } from '../components/SearchInput';
import { CategoryRow } from '../components/CategoryRow';
import { searchVideos } from '../api/youtubeApi';
import { YouTubeVideo } from '../types/youtube';
import { CATEGORIES, Category } from '../constants/categories';
import { RootStackParamList } from '../navigation/RootNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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

  const handleSearch = (query: string) => {
    navigation.navigate('Search', { query });
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    navigation.navigate('VideoDetail', { videoId: video.id.videoId });
  };

  const handleShowMore = (category: Category) => {
    navigation.navigate('Search', { query: category });
  };

  return (
    <View style={styles.container}>
      <SearchInput onSearch={handleSearch} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
