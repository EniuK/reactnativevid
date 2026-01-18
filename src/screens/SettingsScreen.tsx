import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PersonIcon } from '../components/icons/PersonIcon';
import { NotificationIcon } from '../components/icons/NotificationIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { RootStackParamList } from '../navigation/RootNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('12:00');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.profileSection}>
          <PersonIcon width={48} height={48} color="#2B2D42" />
          <Text style={styles.profileName}>John Doe</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <NotificationIcon width={24} height={24} color="#2B2D42" />
            <Text style={styles.remindersTitle}>Learning reminders</Text>
          </View>

          <View style={styles.reminderRow}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderLabel}>Repeat everyday at:</Text>
              <View style={styles.timeContainer}>
                <ClockIcon width={20} height={20} color="#2B2D42" />
                <Text style={styles.timeText}>{reminderTime}</Text>
              </View>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          <Text style={styles.reminderDescription}>
            You will receive friendly reminder to remember to study
          </Text>
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#2B2D42',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#2B2D42',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  remindersSection: {
    padding: 16,
  },
  remindersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  remindersTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#2B2D42',
    marginLeft: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2B2D42',
    marginLeft: 8,
  },
  reminderDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 20,
  },
});
