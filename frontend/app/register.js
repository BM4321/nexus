import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('talent');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const cityCoordinates = {
    'dar es salaam': [39.2083, -6.7924],
    'arusha': [36.68, -3.38],
    'dodoma': [35.7516, -6.1722],
    'mwanza': [32.9175, -2.5164],
    'zanzibar': [39.1925, -6.1659],
    'mbeya': [33.4606, -8.9094],
    'morogoro': [37.6604, -6.8235],
    'tanga': [39.0985, -5.0691],
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !city) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const normalizedCity = city.toLowerCase().trim();
    const coordinates = cityCoordinates[normalizedCity] || [39.2083, -6.7924];

    const location = {
      type: 'Point',
      coordinates: coordinates
    };

    setLoading(true);
    const result = await register(name, email, password, role, location);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');  // Changed from '/home'
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>Create Account</Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 30 }}>Join our talent network</Text>
        
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          style={{ 
            borderWidth: 1, 
            borderColor: '#ddd', 
            padding: 12, 
            marginBottom: 15, 
            borderRadius: 8,
            fontSize: 16 
          }}
        />
        
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
          placeholder="Create a strong password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ 
            borderWidth: 1, 
            borderColor: '#ddd', 
            padding: 12, 
            marginBottom: 15, 
            borderRadius: 8,
            fontSize: 16 
          }}
        />
        
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Role</Text>
        <View style={{ 
          flexDirection: 'row', 
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          <TouchableOpacity
            onPress={() => setRole('talent')}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: role === 'talent' ? '#007AFF' : '#fff',
              alignItems: 'center'
            }}
          >
            <Text style={{ 
              color: role === 'talent' ? '#fff' : '#666',
              fontWeight: role === 'talent' ? 'bold' : 'normal'
            }}>Talent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setRole('client')}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: role === 'client' ? '#007AFF' : '#fff',
              alignItems: 'center',
              borderLeftWidth: 1,
              borderLeftColor: '#ddd'
            }}
          >
            <Text style={{ 
              color: role === 'client' ? '#fff' : '#666',
              fontWeight: role === 'client' ? 'bold' : 'normal'
            }}>Client</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>City</Text>
        <TextInput
          placeholder="e.g., Dar es Salaam, Arusha"
          value={city}
          onChangeText={setCity}
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
          onPress={handleRegister}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#ccc' : '#007AFF', 
            padding: 16, 
            borderRadius: 8, 
            alignItems: 'center' 
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Create Account
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>Already have an account?</Text>
          <Link href="/login" style={{ marginTop: 5, color: '#007AFF', fontWeight: 'bold' }}>
            Sign In
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
