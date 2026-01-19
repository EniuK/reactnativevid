import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { VideoCard } from './VideoCard';
import { YouTubeVideo } from '../types/youtube';
import { Category } from '../constants/categories';

interface CategoryRowProps {
  title: Category;
  videos: YouTubeVideo[];
  loading: boolean;
  onVideoPress: (video: YouTubeVideo) => void;
  onShowMore: (category: Category) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  videos,
  loading,
  onVideoPress,
  onShowMore,
}) => {
  const renderVideo = ({ item }: { item: YouTubeVideo }) => (
    <VideoCard video={item} onPress={() => onVideoPress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => onShowMore(title)}
          style={styles.showMoreButton}
        >
          <Text style={styles.showMoreText}>Show more</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item.id.videoId}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  divider: {
    height: 2,
    backgroundColor: '#2B2D42',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
  },
  showMoreButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2B2D42',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
