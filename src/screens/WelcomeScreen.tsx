import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGuestLogin = () => {
    navigation.replace('MainTabs');
  };

  const handleTermsPress = () => {
    // Placeholder link - can be opened in browser or handled differently
    console.log('Terms and Conditions pressed');
  };

  const handlePrivacyPress = () => {
    // Placeholder link - can be opened in browser or handled differently
    console.log('Privacy Policy pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.youtubeText}>YouTube</Text>
          <Text style={styles.learnText}>LEARN</Text>
        </View>

        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.welcomeText}>
          Welcome to the best YouTube-based learning application.
        </Text>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.guestButtonText}>Log in as guest</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing you agree with</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleTermsPress}>
              <Text style={styles.linkText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> and </Text>
            <TouchableOpacity onPress={handlePrivacyPress}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#AAB2BD',
  },
  container: {
    flex: 1,
    backgroundColor: '#AAB2BD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  youtubeText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  learnText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#343A40',
    marginTop: -8,
  },
  iconContainer: {
    marginVertical: height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
    textAlign: 'left',
    width: '100%',
    marginBottom: height * 0.04,
    lineHeight: 24,
  },
  guestButton: {
    backgroundColor: '#343A40',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textDecorationLine: 'underline',
  },
});
