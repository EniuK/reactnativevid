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
import { ViewsIcon } from '../components/icons/ViewsIcon';
import { LikesIcon } from '../components/icons/LikesIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { BackwardIcon } from '../components/icons/BackwardIcon';
import { ForwardIcon } from '../components/icons/ForwardIcon';
import { PersonIcon } from '../components/icons/PersonIcon';

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

interface Note {
  text: string;
  timestamp: number; // Time in seconds
}

/**
 * Storage key prefix for video notes
 * Format: `video_notes_${videoId}`
 */
const getNotesStorageKey = (videoId: string): string => `video_notes_${videoId}`;

/**
 * Formats time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (e.g., "2:08")
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

/**
 * Formats a number with commas for display (e.g., 25266952 -> "25,266,952")
 * @param {string} numStr - Number as string
 * @returns {string} Formatted number with commas
 */
const formatNumber = (numStr?: string): string => {
  if (!numStr) return '0';
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize video player with HLS stream
  // Using react-native-video v7 API with useVideoPlayer hook
  const player = useVideoPlayer({
    uri: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  });

  /**
   * Loads saved notes for the current video from AsyncStorage
   * @param {string} videoId - The video ID to load notes for
   */
  const loadNotes = async (videoId: string) => {
    try {
      const storageKey = getNotesStorageKey(videoId);
      const savedNotesJson = await AsyncStorage.getItem(storageKey);
      if (savedNotesJson) {
        const savedNotes = JSON.parse(savedNotesJson);
        // Handle both old format (string[]) and new format (Note[])
        if (Array.isArray(savedNotes)) {
          const formattedNotes = savedNotes.map((note) => {
            if (typeof note === 'string') {
              // Old format - convert to new format with timestamp 0
              return { text: note, timestamp: 0 };
            }
            return note;
          });
          setNotes(formattedNotes);
        }
      }
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  /**
   * Saves notes array for the current video to AsyncStorage
   * @param {string} videoId - The video ID to save notes for
   * @param {Note[]} notesArray - The notes array to save
   */
  const saveNotes = async (videoId: string, notesArray: Note[]) => {
    try {
      setNoteSaving(true);
      const storageKey = getNotesStorageKey(videoId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(notesArray));
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setNoteSaving(false);
    }
  };

  /**
   * Adds a new note to the notes array with current video timestamp
   */
  const handleAddNote = () => {
    if (!newNote.trim() || !videoId || !player) return;
    
    // Get current playback time
    const currentTime = player.currentTime || 0;
    
    const newNoteObj: Note = {
      text: newNote.trim(),
      timestamp: currentTime,
    };
    
    const updatedNotes = [...notes, newNoteObj];
    setNotes(updatedNotes);
    setNewNote('');
    saveNotes(videoId, updatedNotes);
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
        // Load saved notes for this video
        await loadNotes(videoId);
      } catch (err) {
        setError('Failed to load video details. Please try again.');
        console.error('Video detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);


  // Auto-play video when details are loaded and player is ready
  useEffect(() => {
    if (player && !loading && videoDetail) {
      player.play();
      setIsPlaying(true);
    }
  }, [player, loading, videoDetail]);

  /**
   * Handles play/pause toggle
   */
  const handlePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  /**
   * Handles backward skip (5 seconds)
   */
  const handleBackward = () => {
    if (!player) return;
    try {
      // Get current time from player and seek backward 5 seconds
      const currentTime = player.currentTime || 0;
      const newTime = Math.max(0, currentTime - 5);
      player.currentTime = newTime;
    } catch (err) {
      console.error('Error seeking backward:', err);
    }
  };

  /**
   * Handles forward skip (5 seconds)
   */
  const handleForward = () => {
    if (!player) return;
    try {
      // Get current time from player and seek forward 5 seconds
      const currentTime = player.currentTime || 0;
      const duration = player.duration || Infinity;
      const newTime = Math.min(duration, currentTime + 5);
      player.currentTime = newTime;
    } catch (err) {
      console.error('Error seeking forward:', err);
    }
  };

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
            <>
              <VideoView
                ref={videoRef}
                player={player}
                style={styles.video}
                controls={false}
                resizeMode="contain"
                keepScreenAwake={true}
              />
              <View style={styles.customControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleBackward}
                  activeOpacity={0.7}
                >
                  <BackwardIcon width={32} height={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.playPauseButton}
                  onPress={handlePlayPause}
                  activeOpacity={0.7}
                >
                  {isPlaying ? (
                    <PauseIcon width={48} height={48} color="#fff" />
                  ) : (
                    <PlayIcon width={48} height={48} color="#fff" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleForward}
                  activeOpacity={0.7}
                >
                  <ForwardIcon width={32} height={32} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{videoDetail.title}</Text>
          <View style={styles.channelContainer}>
            <View style={styles.channelIconContainer}>
              <PersonIcon width={32} height={32} color="#FFFFFF" />
            </View>
            <Text style={styles.channel}>{videoDetail.channelTitle}</Text>
          </View>
          
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
            <>
              <Text style={styles.description}>{videoDetail.description}</Text>
            </>
          ) : (
            <View style={styles.notesContainer}>
              {notes.length > 0 && (
                <View style={styles.notesList}>
                  {notes.map((note, index) => (
                    <View key={index} style={styles.noteItem}>
                      <Text style={styles.noteText}>{note.text}</Text>
                      <Text style={styles.noteTimestamp}>
                        {formatTime(note.timestamp)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={styles.addNoteContainer}>
                <TextInput
                  style={styles.noteInput}
                  value={newNote}
                  onChangeText={setNewNote}
                  placeholder="Enter notes."
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.addNoteButton}
                  onPress={handleAddNote}
                  disabled={!newNote.trim() || noteSaving}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addNoteButtonText}>Add note</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Statistics at bottom */}
      {(videoDetail.viewCount || videoDetail.likeCount) && (
        <View style={styles.bottomStatisticsContainer}>
          {videoDetail.viewCount && (
            <View style={styles.statBox}>
              <ViewsIcon width={20} height={20} color="#FFFFFF" />
              <Text style={styles.statBoxText}>
                {formatNumber(videoDetail.viewCount)} views
              </Text>
            </View>
          )}
          {videoDetail.likeCount && (
            <View style={styles.statBox}>
              <LikesIcon width={20} height={20} color="#FFFFFF" />
              <Text style={styles.statBoxText}>
                {formatNumber(videoDetail.likeCount)} likes
              </Text>
            </View>
          )}
        </View>
      )}
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
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  customControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  channelIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2B2D42',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  channel: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    color: '#666',
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
    borderBottomColor: '#2B2D42',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#C8C8C8',
  },
  activeTabText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2B2D42',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    lineHeight: 22,
  },
  bottomStatisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 6,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B2D42',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    minWidth: 120,
    maxWidth: 150,
  },
  statBoxText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesList: {
    marginBottom: 16,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    lineHeight: 20,
    paddingRight: 50,
  },
  noteTimestamp: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  addNoteContainer: {
    marginTop: 8,
  },
  noteInput: {
    minHeight: 100,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  addNoteButton: {
    backgroundColor: '#2B2D42',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  addNoteButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#ff3b30',
    textAlign: 'center',
  },
});
