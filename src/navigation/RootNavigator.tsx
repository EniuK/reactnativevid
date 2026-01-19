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
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#8D99AE',
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 12,
          justifyContent: 'space-evenly',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 16,
          fontWeight: '400',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcon width={32} height={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <SearchIcon width={32} height={32} color={color} />
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
