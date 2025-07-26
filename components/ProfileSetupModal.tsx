import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Save } from 'lucide-react-native';
import { useProfile } from '@/context/ProfileContext';
interface ProfileSetupModalProps {
  visible: boolean;
  onComplete: (profileData: any) => void;
}

export default function ProfileSetupModal({ visible, onComplete }: ProfileSetupModalProps) {
  const { setProfile } = useProfile();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Personal Information',
      fields: ['name', 'nickname']
    },
    {
      title: 'Contact Information',
      fields: ['email', 'phone']
    },
    {
      title: 'Social Media (Optional)',
      fields: ['instagram', 'twitter', 'linkedin']
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
  const qrValue = email.trim() ? `pingin:${email.trim()}` : 'pingin:default';
  const profileData = {
    name: name || '',
    nickname: nickname || '',
    email: email || '',
    phone: phone || '',
    instagram: instagram || '',
    twitter: twitter || '',
    linkedin: linkedin || '',
    qr_code_data: qrValue,
    ping_tokens: 0,
  };
  setProfile(profileData);
  onComplete(profileData);
};

  const isCurrentStepValid = () => {
    if (currentStep === 0) {
      return name.trim() !== '';
    }
    if (currentStep === 1) {
      return email.trim() !== '';
    }
    return true; // Social media step is optional
  };

  const isFormComplete = () => {
    return name.trim() !== '' && email.trim() !== '';
  };

  // const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
  //   <View style={styles.inputContainer}>
  //     <Text style={styles.inputLabel}>{label}</Text>
  //     <View style={styles.inputWrapper}>
  //       <TextInput
  //         style={styles.input}
  //         value={value}
  //         onChangeText={onChangeText}
  //         placeholder={placeholder}
  //         placeholderTextColor="#999999"
  //         autoCapitalize="none"
  //         autoCorrect={false}
  //         returnKeyType="next"
  //       />
  //     </View>
  //   </View>
  // );

  const renderPersonalInfo = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#999999"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nickname</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Enter your nickname"
          placeholderTextColor="#999999"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>
    </>
  );

  const renderContactInfo = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
      </View>
    </>
  );

   const renderSocialMedia = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Instagram</Text>
        <TextInput
          style={styles.input}
          value={instagram}
          onChangeText={setInstagram}
          placeholder="@username"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Twitter</Text>
        <TextInput
          style={styles.input}
          value={twitter}
          onChangeText={setTwitter}
          placeholder="@username"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>LinkedIn</Text>
        <TextInput
          style={styles.input}
          value={linkedin}
          onChangeText={setLinkedin}
          placeholder="linkedin.com/in/username"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderSocialMedia();
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <User size={32} color="#000000" />
            <Text style={styles.title}>Set up your profile</Text>
            <Text style={styles.subtitle}>
              Step {currentStep + 1} of {steps.length}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* KeyboardAvoidingView ONLY wraps the scrollable content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{steps[currentStep].title}</Text>
              {renderStepContent()}
            </View>
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            {currentStep > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < steps.length - 1 ? (
              <TouchableOpacity 
                onPress={handleNext} 
                style={[
                  styles.nextButton,
                  !isCurrentStepValid() && styles.nextButtonDisabled
                ]}
                disabled={!isCurrentStepValid()}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={handleComplete} 
                style={[
                  styles.completeButton,
                  !isFormComplete() && styles.completeButtonDisabled
                ]}
                disabled={!isFormComplete()}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... styles unchanged ...
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e9ecef',
  },
  progressDotActive: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
    borderRadius: 12,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000000',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});