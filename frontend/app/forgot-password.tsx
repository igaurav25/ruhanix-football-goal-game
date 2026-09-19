import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      Alert.alert("Error", "Bhai, Email aur Naya Password dono daalna zaroori hai!");
      return;
    }

    try {
      const apiUrl = 'http://10.115.249.171/ruhanix_backend/api/auth/forgot-password.php';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert("Success! 🎉", data.message);
        router.replace('/'); 
      } else {
        Alert.alert("Failed ❌", data.message);
      }
    } catch (error) {
      Alert.alert("Network Error", "Server se connect nahi ho paya.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>⚽ Ruhanix FC ⚽</Text>
      <Text style={styles.subtitle}>Reset Password</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Registered Email Address" 
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="New Password" 
          placeholderTextColor="#888"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/')}>
        <Text style={styles.backLinkText}>Wapas Login par jayein</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', 
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a2a2bd',
    marginBottom: 40,
  },
  inputContainer: {
    width: '85%',
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 15,
    width: '85%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 20,
    padding: 10,
  },
  backLinkText: {
    color: '#a2a2bd',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});