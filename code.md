// ...existing code...
  // Replace InputField with direct TextInput usage in each render function

  const renderPersonalInfo = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
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
          value={formData.nickname}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nickname: text }))}
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
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
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
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
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

 // ...existing code...
  // Remove InputField component and use standard TextInput directly

  const renderPersonalInfo = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
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
          value={formData.nickname}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nickname: text }))}
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
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
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
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
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
          value={formData.instagram}
          onChangeText={(text) => setFormData(prev => ({ ...prev, instagram: text }))}
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
          value={formData.twitter}
          onChangeText={(text) => setFormData(prev => ({ ...prev, twitter: text }))}
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
          value={formData.linkedin}
          onChangeText={(text) => setFormData(prev => ({ ...prev, linkedin: text }))}
          placeholder="linkedin.com/in/username"
          placeholderTextColor="#999999"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>
    </>
  );
// ...existing code...
// ...existing code...