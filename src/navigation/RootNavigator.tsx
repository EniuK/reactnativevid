import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { VideoDetailScreen } from '../screens/VideoDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { HomeIcon, SearchIcon } from '../components/icons/SvgIcon';

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  VideoDetail: { videoId: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: { query?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2B2D42',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#E0E0E0',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon width={size} height={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SearchIcon width={size} height={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="VideoDetail"
        component={VideoDetailScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#2B2D42',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
            fontSize: 18,
          },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
