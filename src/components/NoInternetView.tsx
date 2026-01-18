/**
 * No Internet View Component
 * 
 * Displays a user-friendly message when there is no internet connection.
 * Provides a retry button to check connectivity again.
 * 
 * @module NoInternetView
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetworkState } from '../hooks/useNetworkState';

interface NoInternetViewProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * No Internet View Component
 * 
 * Displays when device is offline or has no internet connection.
 * Shows a retry button that checks network state again.
 * 
 * @param {NoInternetViewProps} props - Component props
 * @returns {JSX.Element} No internet connection view
 */
export const NoInternetView: React.FC<NoInternetViewProps> = ({
  onRetry,
  message = 'No internet connection',
}) => {
  const { isConnected } = useNetworkState();

  /**
   * Handles retry button press
   * Checks network state again and calls optional onRetry callback
   */
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📡</Text>
        </View>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          {message}
        </Text>
        <Text style={styles.subtitle}>
          Please check your internet connection and try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        {isConnected === false && (
          <Text style={styles.statusText}>You are currently offline</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
    marginBottom: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    marginTop: 8,
  },
});
