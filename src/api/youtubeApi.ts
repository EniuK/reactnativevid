/**
 * YouTube Data API Integration
 * 
 * This module provides functions to interact with the YouTube Data API v3.
 * It handles video search, popular videos retrieval, and video details fetching.
 * 
 * @module youtubeApi
 */

import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { YouTubeApiResponse, YouTubeVideo, VideoDetail } from '../types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Checks if device has internet connection
 * Uses isConnected as primary check, isInternetReachable as secondary (may be null)
 * @returns {Promise<boolean>} True if connected to internet, false otherwise
 */
const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    // Primary check: isConnected must be true
    // Secondary check: isInternetReachable (if available, must not be false)
    // Note: isInternetReachable can be null on some platforms/devices, so we only check if it's explicitly false
    const isConnected = state.isConnected === true;
    const isInternetReachable = state.isInternetReachable !== false; // true or null is OK, only false is bad
    
    return isConnected && isInternetReachable;
  } catch (error) {
    console.warn('Error checking network connection:', error);
    // If NetInfo fails, assume connection exists and let API call handle the error
    return true;
  }
};

/**
 * Retrieves the YouTube API key from Expo configuration.
 * Reads directly from Constants.expoConfig.extra.youtubeApiKey each time.
 * The API key should be set in the .env file as YOUTUBE_API_KEY.
 * 
 * Note: Cache was removed to allow API key updates in .env without app restart.
 * Reading from Constants is not expensive and allows hot reloading of config changes.
 * 
 * @returns {string} The YouTube API key
 * @throws {Error} If the API key is not configured
 */
const getApiKey = (): string => {
  // Read API key directly from Expo configuration each time
  // This allows updating the key in .env without clearing cache
  const apiKey = Constants.expoConfig?.extra?.youtubeApiKey;
  if (!apiKey) {
    throw new Error(
      'YOUTUBE_API_KEY environment variable is not set. Please create a .env file with YOUTUBE_API_KEY=your_key'
    );
  }

  return apiKey;
};

/**
 * Sort order options for YouTube API search results
 */
export type SortOrder = 'date' | 'rating' | 'relevance' | 'title' | 'viewCount';

/**
 * Searches for videos on YouTube based on a query string.
 * 
 * This function uses the YouTube Data API v3 search endpoint to find videos
 * matching the provided query. Results can be sorted by various criteria.
 * 
 * @param {string} query - The search query string
 * @param {number} maxResults - Maximum number of results to return (default: 10)
 * @param {SortOrder} order - Sort order for results (default: 'relevance')
 * @returns {Promise<YouTubeVideo[]>} Array of video results
 * @throws {Error} If the API request fails
 * 
 * @example
 * const videos = await searchVideos('react native tutorial', 20, 'date');
 */
export const searchVideos = async (
  query: string,
  maxResults: number = 10,
  order: SortOrder = 'relevance'
): Promise<YouTubeVideo[]> => {
  try {
    // Check internet connection before making request
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.warn('No internet connection. Cannot fetch videos.');
      return [];
    }

    // Validate query is provided
    if (!query || !query.trim()) {
      console.warn('Empty query provided to searchVideos');
      return [];
    }

    const apiKey = getApiKey();
    const trimmedQuery = query.trim();
    
    const response = await axios.get<YouTubeApiResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: trimmedQuery,
          type: 'video',
          maxResults,
          order,
          key: apiKey,
        },
        timeout: 10000, // 10 second timeout
      }
    );
    return response.data.items || [];
  } catch (error) {
    const axiosError = error as AxiosError<{
      error?: { message?: string };
    }>;
    // Handle network errors (no internet, timeout, etc.)
    if (
      axiosError.code === 'NETWORK_ERROR' ||
      axiosError.message === 'Network Error' ||
      !axiosError.response
    ) {
      console.warn('Network error: No internet connection or request timeout');
      return [];
    }

    if (axiosError.response?.status === 403) {
      const errorMessage =
        axiosError.response.data?.error?.message || 'Unknown error';
      console.warn('YouTube API 403 Forbidden Error:', {
        message: 'API key may be invalid, missing permissions, or YouTube Data API v3 not enabled',
        errorMessage,
        suggestion: 'Please check: 1) API key is correct, 2) YouTube Data API v3 is enabled in Google Cloud Console, 3) API key has proper permissions.',
      });
      return [];
    }
    if (axiosError.response?.status === 400) {
      console.warn(
        'YouTube API 400 Bad Request:',
        axiosError.response.data?.error?.message
      );
      return [];
    }
    if (axiosError.response?.status === 429) {
      console.warn('YouTube API 429 Too Many Requests: Rate limit exceeded');
      return [];
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      console.warn('YouTube API Server Error:', axiosError.response.status);
      return [];
    }
    console.error('Error fetching videos:', axiosError);
    return [];
  }
};

/**
 * Retrieves popular videos based on view count.
 * 
 * Fetches videos sorted by view count (most viewed first).
 * Uses a default query 'programming tutorial' to get relevant content.
 * 
 * @param {number} maxResults - Maximum number of results to return (default: 20)
 * @returns {Promise<YouTubeVideo[]>} Array of popular video results
 * @throws {Error} If the API request fails
 */
export const getPopularVideos = async (
  maxResults: number = 20
): Promise<YouTubeVideo[]> => {
  try {
    // Check internet connection before making request
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.warn('No internet connection. Cannot fetch popular videos.');
      return [];
    }

    const apiKey = getApiKey();
    const response = await axios.get<YouTubeApiResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: 'programming tutorial',
          type: 'video',
          maxResults,
          order: 'viewCount',
          key: apiKey,
        },
        timeout: 10000, // 10 second timeout
      }
    );
    return response.data.items || [];
  } catch (error) {
    const axiosError = error as AxiosError<{
      error?: { message?: string };
    }>;
    // Handle network errors (no internet, timeout, etc.)
    if (
      axiosError.code === 'NETWORK_ERROR' ||
      axiosError.message === 'Network Error' ||
      !axiosError.response
    ) {
      console.warn('Network error: No internet connection or request timeout');
      return [];
    }

    if (axiosError.response?.status === 403) {
      const errorMessage =
        axiosError.response.data?.error?.message || 'Unknown error';
      console.warn('YouTube API 403 Forbidden Error:', {
        message: 'API key may be invalid, missing permissions, or YouTube Data API v3 not enabled',
        errorMessage,
        suggestion: 'Please check: 1) API key is correct, 2) YouTube Data API v3 is enabled in Google Cloud Console, 3) API key has proper permissions.',
      });
      return [];
    }
    if (axiosError.response?.status === 400) {
      console.warn(
        'YouTube API 400 Bad Request:',
        axiosError.response.data?.error?.message
      );
      return [];
    }
    if (axiosError.response?.status === 429) {
      console.warn('YouTube API 429 Too Many Requests: Rate limit exceeded');
      return [];
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      console.warn('YouTube API Server Error:', axiosError.response.status);
      return [];
    }
    console.error('Error fetching popular videos:', axiosError);
    return [];
  }
};

/**
 * Fetches detailed information about a specific video.
 * 
 * Retrieves video metadata including title, description, and channel information
 * using the YouTube Data API v3 videos endpoint.
 * 
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<VideoDetail>} Video detail object with title, description, and channel
 * @throws {Error} If the video is not found or the API request fails
 * 
 * @example
 * const details = await getVideoDetails('dQw4w9WgXcQ');
 */
export const getVideoDetails = async (videoId: string): Promise<VideoDetail> => {
  try {
    // Check internet connection before making request
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      throw new Error('No internet connection. Cannot load video details.');
    }

    const apiKey = getApiKey();
    const response = await axios.get<{ 
      items: Array<{ 
        id: string; 
        snippet: { title: string; description: string; channelTitle: string };
        statistics?: { viewCount?: string; likeCount?: string };
      }> 
    }>(
      `${YOUTUBE_API_BASE_URL}/videos`,
      {
        params: {
          part: 'snippet,statistics',
          id: videoId,
          key: apiKey,
        },
        timeout: 10000, // 10 second timeout
      }
    );
    
    const video = response.data.items[0];
    if (!video) {
      throw new Error('Video not found');
    }
    
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    // Handle network errors (no internet, timeout, etc.)
    if (
      axiosError.code === 'NETWORK_ERROR' ||
      axiosError.message === 'Network Error' ||
      !axiosError.response
    ) {
      if (axiosError.message && axiosError.message.includes('No internet connection')) {
        throw error; // Re-throw our custom message
      }
      throw new Error('No internet connection. Cannot load video details.');
    }

    if (axiosError.response?.status === 403) {
      console.warn('YouTube API 403 Forbidden Error when fetching video details');
      throw new Error('Unable to load video details. Please check your API configuration.');
    }
    if (axiosError.response?.status === 404) {
      throw new Error('Video not found');
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    console.error('Error fetching video details:', axiosError);
    throw new Error('Failed to load video details. Please try again.');
  }
};
