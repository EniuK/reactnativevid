import axios from 'axios';
import Constants from 'expo-constants';
import { YouTubeApiResponse, YouTubeVideo, VideoDetail } from '../types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const getApiKey = (): string => {
  const apiKey = Constants.expoConfig?.extra?.youtubeApiKey;
  if (!apiKey) {
    throw new Error(
      'YOUTUBE_API_KEY environment variable is not set. Please create a .env file with YOUTUBE_API_KEY=your_key'
    );
  }
  return apiKey;
};

export const searchVideos = async (
  query: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> => {
  try {
    const response = await axios.get<YouTubeApiResponse>(
      `${YOUTUBE_API_BASE_URL}/search`,
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
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
