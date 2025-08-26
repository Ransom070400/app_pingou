import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, Easing } from 'react-native';
import { Mail, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

function DancingPenguin() {
  // Animation hooks for bounce and rotate
  const bounce = useState(() => new Animated.Value(0))[0];
  const rotate = useState(() => new Animated.Value(0))[0];

  // Start the animation loop
  useState(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -12,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  return (
    <Animated.View
      style={{
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: bounce }, { rotate: rotateInterpolate }],
      }}
    >
      {/* Penguin Body */}
      <View style={styles.penguinBody}>
        {/* Head */}
        <View style={styles.penguinHead}>
          <View style={styles.penguinEye} />
          <View style={[styles.penguinEye, { marginLeft: 10 }]} />
          <View style={styles.penguinBeak} />
        </View>
        {/* Belly */}
        <View style={styles.penguinBelly} />
        {/* Wings */}
        <View style={[styles.penguinWing, { left: -16, transform: [{ rotate: '-18deg' }] }]} />
        <View style={[styles.penguinWing, { right: -16, left: undefined, transform: [{ rotate: '18deg' }] }]} />
        {/* Feet */}
        <View style={[styles.penguinFoot, { left: 12 }]} />
        <View style={[styles.penguinFoot, { right: 12 }]} />
      </View>
    </Animated.View>
  );
}

export default function LoginScreen({
  onLogin,
  onSetupProfile,
  onAuthResult, // NEW
}: {
  onLogin: (email: string) => void;
  onSetupProfile?: (email: string) => void;
  onAuthResult?: (r: { success: boolean; needsProfile: boolean; email: string; error?: string }) => void; // NEW
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (!signInError && signInData?.user) {
        onLogin(email.trim());
        onAuthResult?.({ success: true, needsProfile: false, email: email.trim() }); // NEW
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (!signUpError && signUpData?.user) {
        onSetupProfile?.(email.trim());
        onAuthResult?.({ success: true, needsProfile: true, email: email.trim() }); // NEW
        return;
      }

      const message = signUpError?.message || signInError?.message || 'Authentication failed.';
      setError(message);
      onAuthResult?.({ success: false, needsProfile: false, email: email.trim(), error: message }); // NEW
    } catch (e: any) {
      const message = e?.message ?? 'Something went wrong.';
      setError(message);
      onAuthResult?.({ success: false, needsProfile: false, email: email.trim(), error: message }); // NEW
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* Animated Penguin logo */}
              <DancingPenguin />
            </View>
            <Text style={styles.title}>Welcome to Pingou</Text>
            <Text style={styles.subtitle}>Your networking companion</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={20} color="#666666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#666666" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.passwordToggle}>
                {showPassword ? <EyeOff size={20} color="#666666" /> : <Eye size={20} color="#666666" />}
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.loginButton, (!email.trim() || !password) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!email.trim() || !password || isLoading}
            >
              <Text style={[styles.loginButtonText, (!email.trim() || !password) && styles.loginButtonTextDisabled]}>
                {isLoading ? 'Signing in...' : 'Continue'}
              </Text>
              <ArrowRight 
                size={20} 
                color={email.trim() && password ? "#FFFFFF" : "#999999"} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const penguinColor = "#000";
const penguinBeakColor = "#FF8C00";
const penguinFootColor = "#FFB347";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 30,
  },

  // Penguin Styles
  penguinBody: {
    alignItems: 'center',
    position: 'relative',
  },
  penguinHead: {
    width: 38,
    height: 38,
    backgroundColor: penguinColor,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 4,
  },
  penguinEye: {
    width: 7,
    height: 7,
    backgroundColor: '#FFF',
    borderRadius: 3.5,
    marginTop: -3,
  },
  penguinBeak: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: penguinBeakColor,
    position: 'absolute',
    bottom: -7,
    left: 10,
  },
  penguinBelly: {
    width: 35,
    height: 50,
    backgroundColor: penguinColor,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 3,
  },
  penguinWing: {
    position: 'absolute',
    top: 26,
    width: 13,
    height: 27,
    backgroundColor: penguinColor,
    borderRadius: 9,
    zIndex: 1,
  },
  penguinFoot: {
    position: 'absolute',
    bottom: -8,
    width: 11,
    height: 6,
    backgroundColor: penguinFootColor,
    borderRadius: 5,
    zIndex: 0,
  },

  // Rest of your styles
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  passwordToggle: {
    marginLeft: 10,
  },
  errorText: {
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#e9ecef',
    shadowOpacity: 0.05,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  loginButtonTextDisabled: {
    color: '#999999',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});