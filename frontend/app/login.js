
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/home');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>Welcome Back</Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 40 }}>Sign in to continue</Text>
      
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Email Address</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          marginBottom: 15,
          borderRadius: 8,
          fontSize: 16
        }}
      />
      
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          marginBottom: 25,
          borderRadius: 8,
          fontSize: 16
        }}
      />
      
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007AFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Don't have an account?</Text>
        <Link href="/register" style={{ marginTop: 5, color: '#007AFF', fontWeight: 'bold' }}>
          Create Account
        </Link>
      </View>
    </View>
  );
}