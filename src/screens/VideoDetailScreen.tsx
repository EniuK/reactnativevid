/**
 * Video Detail Screen
 * 
 * Displays video playback and detailed information about a selected video.
 * Uses react-native-video v7 with NitroModules for native video playback.
 * 
 * Features:
 * - HLS video playback with native controls (fullscreen and minimized support)
 * - Video metadata display (title, channel, description)
 * - Tab navigation (Details/Notes)
 * - Local notes storage per video using AsyncStorage
 * - Auto-play functionality
 * - Error handling and loading states
 * - Safe area support for all device types
 * 
 * @module VideoDetailScreen
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
const VIDEO_HEIGHT = width * 0.5625; // 16:9 aspect ratio

type TabType = 'Details' | 'Notes';

/**
 * Storage key prefix for video notes
 * Format: `video_note_${videoId}`
 */
const getNoteStorageKey = (videoId: string): string => `video_note_${videoId}`;

/**
 * VideoDetailScreen Component
 * 
 * Main component for displaying and playing video content.
 * Integrates with react-native-video v7 beta using NitroModules architecture.
 * 
 * @param {VideoDetailScreenProps} props - Component props
 * @returns {JSX.Element} Video detail screen with player and metadata
 */
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
  const [activeTab, setActiveTab] = useState<TabType>('Details');
  const [note, setNote] = useState<string>('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Initialize video player with HLS stream
  // Using react-native-video v7 API with useVideoPlayer hook
  const player = useVideoPlayer({
    uri: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  });

  /**
   * Loads saved note for the current video from AsyncStorage
   * @param {string} videoId - The video ID to load notes for
   */
  const loadNote = async (videoId: string) => {
    try {
      const storageKey = getNoteStorageKey(videoId);
      const savedNote = await AsyncStorage.getItem(storageKey);
      if (savedNote) {
        setNote(savedNote);
      }
    } catch (err) {
      console.error('Error loading note:', err);
    }
  };

  /**
   * Saves note for the current video to AsyncStorage
   * @param {string} videoId - The video ID to save notes for
   * @param {string} noteText - The note text to save
   */
  const saveNote = async (videoId: string, noteText: string) => {
    try {
      setNoteSaving(true);
      const storageKey = getNoteStorageKey(videoId);
      await AsyncStorage.setItem(storageKey, noteText);
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setNoteSaving(false);
    }
  };

  // Fetch video details from YouTube API when videoId changes
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
        // Load saved note for this video
        await loadNote(videoId);
      } catch (err) {
        setError('Failed to load video details. Please try again.');
        console.error('Video detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  // Save note automatically when it changes (debounced)
  useEffect(() => {
    if (!videoId || !note) return;

    const timer = setTimeout(() => {
      saveNote(videoId, note);
    }, 1000); // Debounce: save 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [note, videoId]);

  // Auto-play video when details are loaded and player is ready
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
          
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Details' && styles.activeTab]}
              onPress={() => setActiveTab('Details')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Details' && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Notes' && styles.activeTab]}
              onPress={() => setActiveTab('Notes')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Notes' && styles.activeTabText,
                ]}
              >
                Notes
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Tab Content */}
          {activeTab === 'Details' ? (
            <Text style={styles.description}>{videoDetail.description}</Text>
          ) : (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Your notes for this video:</Text>
              <TextInput
                style={styles.notesInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add your notes here..."
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
              {noteSaving && (
                <Text style={styles.savingText}>Saving...</Text>
              )}
            </View>
          )}
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
    marginTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  activeTabText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#007AFF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    lineHeight: 22,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2B2D42',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 200,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  savingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ff3b30',
    textAlign: 'center',
  },
});
