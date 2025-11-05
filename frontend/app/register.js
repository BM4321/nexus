import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role, location);
    setLoading(false);

    if (result.success) {
      router.replace('/home');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Register</Text>
        
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
        />
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
        />
        
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}
        />
        
        <TextInput
          placeholder="Location (e.g., Dar es Salaam)"
          value={location}
          onChangeText={setLocation}
          style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 20, borderRadius: 5 }}
        />
        
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {loading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>
        
        <Link href="/login" style={{ marginTop: 20, textAlign: 'center', color: '#007AFF' }}>
          Already have an account? Login
        </Link>
      </View>
    </ScrollView>
  );
}