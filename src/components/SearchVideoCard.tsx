import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { YouTubeVideo } from '../types/youtube';

const { width } = Dimensions.get('window');

interface SearchVideoCardProps {
  video: YouTubeVideo;
  onPress: () => void;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return '12.08.2024';
  }
};

export const SearchVideoCard: React.FC<SearchVideoCardProps> = ({
  video,
  onPress,
}) => {
  const publishedDate = formatDate(video.snippet.publishedAt || new Date().toISOString());

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.snippet.thumbnails.medium.url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.banner}>
          <Text style={styles.bannerText}>100 SECONDS OF</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.channelName}>{video.snippet.channelTitle}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {video.snippet.description || video.snippet.title}
        </Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{publishedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.56,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5DADE2',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bannerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  info: {
    padding: 16,
    backgroundColor: '#fff',
  },
  channelName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
});
