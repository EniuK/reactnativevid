require('dotenv').config();

module.exports = {
  expo: {
    name: 'twg-video-app',
    slug: 'twg-video-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      bundleIdentifier: 'com.anonymous.twgvideoapp',
      supportsTablet: true,
    },
    android: {
      package: 'com.anonymous.twgvideoapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'react-native-video',
        {
          enableAndroidPictureInPicture: true,
          enableBackgroundAudio: true,
          androidExtensions: {
            useExoplayerDash: true,
            useExoplayerHls: true,
          },
        },
      ],
      'expo-font',
    ],
    extra: {
      youtubeApiKey: process.env.YOUTUBE_API_KEY,
    },
  },
};
