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

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: video.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {video.snippet.title}
        </Text>
        <Text style={styles.channel} numberOfLines={1}>
          {video.snippet.channelTitle}
        </Text>
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: CARD_WIDTH * 0.56,
    backgroundColor: '#f0f0f0',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  channel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
});
