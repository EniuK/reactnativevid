import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { AppIcon } from '../components/SvgIcon';

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
    Linking.openURL('https://example.com/terms');
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://example.com/privacy');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.iconContainer}>
          <AppIcon width={120} height={120} color="#343A40" />
        </View>

        <Text style={styles.welcomeText}>
          Welcome to the best{'\n'}YouTube-based learning{'\n'}application.
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
    backgroundColor: '#8D99AE',
  },
  container: {
    flex: 1,
    backgroundColor: '#8D99AE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: height * 0.08,
    paddingHorizontal: 24,
  },
  logo: {
    width: width * 0.8,
    height: (width * 0.8 * 116) / 292,
    maxWidth: 292,
    maxHeight: 116,
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
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#fff',
    textAlign: 'left',
    width: '100%',
    marginBottom: height * 0.04,
    lineHeight: 24,
    letterSpacing: 0.18, // 1% of 18px = 0.18px
    paddingHorizontal: 24,
  },
  guestButton: {
    backgroundColor: '#2B2D42',
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
    color: '#fff',
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
    color: '#2B2D42',
    textDecorationLine: 'underline',
  },
});
