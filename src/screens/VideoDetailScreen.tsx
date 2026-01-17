import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Video from 'react-native-video';
import { getVideoDetails } from '../api/youtubeApi';
import { VideoDetail } from '../types/youtube';
import { RootStackParamList } from '../navigation/RootNavigator';

type VideoDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VideoDetail'
>;

type VideoDetailScreenRouteProp = RouteProp<RootStackParamList, 'VideoDetail'>;

interface VideoDetailScreenProps {
  navigation: VideoDetailScreenNavigationProp;
  route: VideoDetailScreenRouteProp;
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625; // 16:9 aspect ratio

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { videoId } = route.params;
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const details = await getVideoDetails(videoId);
        setVideoDetail(details);
      } catch (err) {
        setError('Failed to load video details.');
        console.error('Video detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !videoDetail) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Video not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.videoContainer}>
        <Video
          source={{
            uri: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
          }}
          style={styles.video}
          controls
          resizeMode="contain"
          fullscreen
          fullscreenAutorotate
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{videoDetail.title}</Text>
        <Text style={styles.channel}>{videoDetail.channelTitle}</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>{videoDetail.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  videoContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  channel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ff3b30',
    textAlign: 'center',
  },
});
