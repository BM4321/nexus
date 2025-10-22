import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Import the Auth hook

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the login function from the context
  const { login } = useAuth(); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsProcessing(true);
    try {
      // 🚀 Call the login function from AuthContext, which hits the backend API
      await login(email, password);
      
      // If successful, the AuthContext's state update will trigger a redirect 
      // via the _layout.js file. We don't need 'router.replace' here.
    } catch (error) {
      const message = error.message || 'Login failed. Check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="text-4xl font-extrabold text-indigo-700 mb-2">Nexus</Text>
      <Text className="text-lg text-gray-500 mb-10">Sign in to find talent or opportunities</Text>
      
      {/* Email Input */}
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      {/* Password Input */}
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg p-3 mb-6 bg-white"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Login Button */}
      <TouchableOpacity
        className={`w-full h-12 rounded-lg items-center justify-center ${isProcessing ? 'bg-indigo-300' : 'bg-indigo-600'}`}
        onPress={handleLogin}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <View className="flex-row mt-6">
        <Text className="text-gray-600">Don't have an account? </Text>
        {/* We need a register screen for this link to work */}
        <Link href="/register" className="text-indigo-600 font-semibold">
          Register
        </Link>
      </View>
    </View>
  );
}