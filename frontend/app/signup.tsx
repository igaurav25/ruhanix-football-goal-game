import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Bhai, Name, Email aur Password teeno daalna zaroori hai!");
      return;
    }

    try {
      // Tumhara IP address aur register API ka link
      const apiUrl = 'http://10.115.249.171/ruhanix_backend/api/auth/register.php';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert("Welcome! 🎉", "Account ban gaya bhai! Ab login karo.");
        // Account banne ke baad wapas Login screen par bhej do
        router.replace('/');
      } else {
        Alert.alert("Signup Failed ❌", data.message);
      }
    } catch (error) {
      Alert.alert("Network Error", "Server se connect nahi ho paya.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>⚽ Ruhanix FC ⚽</Text>
      <Text style={styles.subtitle}>Create New Player</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Player Name (e.g. ProGamer)" 
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/')}>
        <Text style={styles.loginLinkText}>Pehle se account hai? Login karo</Text>
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
    color: '#4caf50',
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
    backgroundColor: '#4caf50',
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
  loginLink: {
    marginTop: 20,
    padding: 10,
  },
  loginLinkText: {
    color: '#e94560',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});