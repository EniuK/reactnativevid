/**
 * YouTube Data API Integration
 * 
 * This module provides functions to interact with the YouTube Data API v3.
 * It handles video search, popular videos retrieval, and video details fetching.
 * 
 * @module youtubeApi
 */

import axios from 'axios';
import Constants from 'expo-constants';
import { YouTubeApiResponse, YouTubeVideo, VideoDetail } from '../types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Retrieves the YouTube API key from Expo configuration.
 * The API key should be set in the .env file as YOUTUBE_API_KEY.
 * 
 * @returns {string} The YouTube API key
 * @throws {Error} If the API key is not configured
 */
const getApiKey = (): string => {
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
    const response = await axios.get<YouTubeApiResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: query || 'programming tutorial',
          type: 'video',
          maxResults,
          order,
          key: getApiKey(),
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
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
    const response = await axios.get<YouTubeApiResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: 'programming tutorial',
          type: 'video',
          maxResults,
          order: 'viewCount',
          key: getApiKey(),
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    throw error;
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
    const response = await axios.get<{ items: Array<{ id: string; snippet: { title: string; description: string; channelTitle: string } }> }>(
      `${YOUTUBE_API_BASE_URL}/videos`,
      {
        params: {
          part: 'snippet',
          id: videoId,
          key: getApiKey(),
        },
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
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};
