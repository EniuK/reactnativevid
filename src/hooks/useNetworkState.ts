/**
 * Network State Hook
 * 
 * Custom hook for monitoring network connectivity state.
 * Uses @react-native-community/netinfo to detect network status.
 * 
 * @module useNetworkState
 */

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Network state interface
 */
export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Custom hook for monitoring network connectivity
 * 
 * @returns {NetworkState} Current network state with isConnected, isInternetReachable, and type
 * 
 * @example
 * const networkState = useNetworkState();
 * if (!networkState.isConnected) {
 *   return <NoInternetView />;
 * }
 */
export const useNetworkState = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return networkState;
};
