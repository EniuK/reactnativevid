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
import { SettingsIcon } from '../components/icons/SvgIcon';
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
    if (query.trim()) {
      navigation.navigate('Search', { query: query.trim() });
    }
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    if (video?.id?.videoId) {
      navigation.navigate('VideoDetail', { videoId: video.id.videoId });
    }
  };

  const handleShowMore = (category: Category) => {
    navigation.navigate('Search', { query: category });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

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
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
