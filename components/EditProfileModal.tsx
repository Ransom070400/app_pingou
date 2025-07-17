import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Save } from 'lucide-react-native';

interface EditProfileModalProps {
  visible: boolean;
  profile: any;
  onClose: () => void;
  onSave: (profile: any) => void;
}

export default function EditProfileModal({ visible, profile, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    nickname: profile.nickname,
    email: profile.email,
    phone: profile.phone,
    instagram: profile.instagram,
    twitter: profile.twitter,
    linkedin: profile.linkedin,
  });

  const handleSave = () => {
    onSave({ ...profile, ...formData });
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <InputField
              label="Full Name"
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <InputField
              label="Email"
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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media</Text>
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
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
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
  bottomSpacing: {
    height: 40,
  },
});