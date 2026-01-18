import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { VideoView, VideoViewRef, useVideoPlayer } from 'react-native-video';
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
const VIDEO_HEIGHT = width * 0.5625;

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const videoRef = useRef<VideoViewRef>(null);
  const videoId = route.params?.videoId;
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const player = useVideoPlayer({
    uri: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  });

  useEffect(() => {
    if (!videoId) {
      setError('Video ID is missing');
      setLoading(false);
      return;
    }

    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getVideoDetails(videoId);
        setVideoDetail(details);
      } catch (err) {
        setError('Failed to load video details. Please try again.');
        console.error('Video detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  useEffect(() => {
    if (player && !loading && videoDetail) {
      player.play();
    }
  }, [player, loading, videoDetail]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !videoDetail) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Video not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoContainer}>
          {videoError ? (
            <View style={styles.videoErrorContainer}>
              <Text style={styles.videoErrorText}>{videoError}</Text>
            </View>
          ) : (
            <VideoView
              ref={videoRef}
              player={player}
              style={styles.video}
              controls
              resizeMode="contain"
              keepScreenAwake={true}
            />
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{videoDetail.title}</Text>
          <Text style={styles.channel}>{videoDetail.channelTitle}</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>{videoDetail.description}</Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  videoContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoErrorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  videoErrorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
    marginBottom: 8,
    lineHeight: 28,
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
    color: '#2B2D42',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ff3b30',
    textAlign: 'center',
  },
});
