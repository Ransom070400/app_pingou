import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Save } from 'lucide-react-native';

interface ProfileSetupModalProps {
  visible: boolean;
  onComplete: (profileData: any) => void;
}

export default function ProfileSetupModal({ visible, onComplete }: ProfileSetupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    instagram: '',
    twitter: '',
    linkedin: '',
  });

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
    onComplete(formData);
  };

  const isCurrentStepValid = () => {
    const currentFields = steps[currentStep].fields;
    if (currentStep < 2) { // Required steps
      return currentFields.some(field => formData[field].trim() !== '');
    }
    return true; // Social media step is optional
  };

  const isFormComplete = () => {
    return formData.name.trim() !== '' && formData.email.trim() !== '';
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const renderPersonalInfo = () => (
    <>
      <InputField
        label="Full Name *"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        placeholder="Enter your full name"
      />
      <InputField
        label="Nickname"
        value={formData.nickname}
        onChangeText={(text) => setFormData(prev => ({ ...prev, nickname: text }))}
        placeholder="Enter your nickname"
      />
    </>
  );

  const renderContactInfo = () => (
    <>
      <InputField
        label="Email *"
        value={formData.email}
        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <InputField
        label="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
    </>
  );

  const renderSocialMedia = () => (
    <>
      <InputField
        label="Instagram"
        value={formData.instagram}
        onChangeText={(text) => setFormData(prev => ({ ...prev, instagram: text }))}
        placeholder="@username"
      />
      <InputField
        label="Twitter"
        value={formData.twitter}
        onChangeText={(text) => setFormData(prev => ({ ...prev, twitter: text }))}
        placeholder="@username"
      />
      <InputField
        label="LinkedIn"
        value={formData.linkedin}
        onChangeText={(text) => setFormData(prev => ({ ...prev, linkedin: text }))}
        placeholder="linkedin.com/in/username"
      />
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
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{steps[currentStep].title}</Text>
            {renderStepContent()}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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