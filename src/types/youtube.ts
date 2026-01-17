/**
 * TypeScript type definitions for YouTube Data API responses
 * These interfaces ensure type safety when working with YouTube API data
 */

/**
 * Represents a single video item from YouTube API search results
 */
export interface YouTubeVideo {
  id: {
    videoId: string; // Unique identifier for the video
  };
  snippet: {
    title: string; // Video title
    description: string; // Video description
    thumbnails: {
      medium: {
        url: string; // URL to the medium-sized thumbnail image
      };
    };
    channelTitle: string; // Name of the channel that uploaded the video
  };
}

/**
 * Response structure from YouTube API search endpoint
 */
export interface YouTubeApiResponse {
  items: YouTubeVideo[]; // Array of video results
  nextPageToken?: string; // Optional token for pagination (not used in current implementation)
}

/**
 * Simplified video detail structure for video detail screen
 * Contains only the essential information needed for display
 */
export interface VideoDetail {
  id: string; // Video ID
  title: string; // Video title
  description: string; // Full video description
  channelTitle: string; // Channel name
}
