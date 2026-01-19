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
const CARD_WIDTH = width * 0.75;

interface VideoCardProps {
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

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const publishedDate = formatDate(video.snippet.publishedAt || new Date().toISOString());

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.snippet.thumbnails.medium.url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {video.snippet.title}
        </Text>
        <Text style={styles.date}>{publishedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.56,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2B2D42',
    marginBottom: 4,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'right',
  },
});
