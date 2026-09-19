import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Auto-Login Check: Agar session pehle se saved hai toh seedha Lobby bhejo
  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userSession');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        router.replace({
          pathname: '/lobby',
          params: { email: userData.email, name: userData.name, level: userData.current_level, xp: userData.xp }
        } as any);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      const response = await fetch('http://10.115.249.171/ruhanix_backend/api/auth/login.php', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, password })
      });
      
      const rawText = await response.text(); 
      console.log("BACKEND KA JAWAB: ", rawText); 

      try {
        const data = JSON.parse(rawText);

        if (data.status === 'success') {
          // Yahan fix kiya hai: data.user ki jagah data.data
          await AsyncStorage.setItem('userSession', JSON.stringify(data.data));
          
          // Seedha lobby bhej do
          router.replace({
            pathname: '/lobby',
            params: { email: data.data.email, name: data.data.name, level: data.data.current_level, xp: data.data.xp }
          } as any);
        } else {
          Alert.alert("Login Failed", data.message || "Invalid credentials");
        }
      } catch (parseError) {
        Alert.alert("Error", "Kuch technical dikkat aayi AsyncStorage mein.");
        console.log("Error: ", parseError);
      }

    } catch (error: any) {
      Alert.alert("Network Error", error.message);
      console.log("Asali Error: ", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ RUHANIX LOGIN ⚽</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Enter Email" 
        placeholderTextColor="#aaa" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Enter Password" 
        placeholderTextColor="#aaa" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Signup Button */}
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/signup' as any)}
      >
        <Text style={styles.linkText}>Don't have an account? <Text style={styles.highlightText}>Sign Up</Text></Text>
      </TouchableOpacity>

      {/* Forgot Password Button */}
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/forgot-password' as any)}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f3460', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#e94560', marginBottom: 30 },
  input: { width: '85%', backgroundColor: '#1a1a2e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#e94560', width: '85%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkButton: { marginTop: 12 },
  linkText: { color: '#a2a2bd', fontSize: 15 },
  highlightText: { color: '#00ffcc', fontWeight: 'bold' }
});