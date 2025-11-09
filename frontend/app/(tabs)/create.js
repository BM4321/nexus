import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { router } from 'expo-router';

const API_URL = 'http://localhost:3000/api';

export default function CreateListingScreen() {
  const { user, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [type, setType] = useState(user?.role === 'talent' ? 'service' : 'opportunity');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Categories based on TSD
  const categories = [
    'Music', 'IT', 'Construction', 'Marketing', 
    'Education', 'Design', 'Writing', 'Other'
  ];

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setPriceRange('');
    setType(user?.role === 'talent' ? 'service' : 'opportunity');
  };

  const handleCreate = async () => {
    // Validation
    if (!title || !description || !category || !priceRange) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const token = await getToken();
      
      const listingData = {
        type,
        title,
        description,
        category,
        priceRange,
        location: user.location || {
          type: 'Point',
          coordinates: [39.2083, -6.7924]
        },
        status: 'active'
      };

      const response = await axios.post(`${API_URL}/listings`, listingData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Show success state
      setSuccess(true);
      clearForm();

      // Auto redirect after 2 seconds
      setTimeout(() => {
        router.push('/(tabs)');
      }, 2000);

    } catch (error) {
      console.error('Create listing error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7', padding: 20 }}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>✅</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Listing Created!</Text>
        <Text style={{ fontSize: 16, color: '#8E8E93', textAlign: 'center' }}>
          Your listing has been published successfully
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          style={{
            marginTop: 24,
            backgroundColor: '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>View All Listings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
          Create Listing
        </Text>
        <Text style={{ fontSize: 14, color: '#8E8E93' }}>
          {type === 'service' ? 'Offer your skills to the community' : 'Post a job opportunity'}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        {/* Type Selection */}
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Listing Type</Text>
        <View style={{ 
          flexDirection: 'row', 
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#E5E5EA',
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}>
          <TouchableOpacity
            onPress={() => setType('service')}
            style={{
              flex: 1,
              padding: 14,
              backgroundColor: type === 'service' ? '#007AFF' : '#fff',
              alignItems: 'center'
            }}
          >
            <Text style={{ 
              fontSize: 16,
              color: type === 'service' ? '#fff' : '#3C3C43',
              fontWeight: type === 'service' ? 'bold' : 'normal'
            }}>🎯 Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType('opportunity')}
            style={{
              flex: 1,
              padding: 14,
              backgroundColor: type === 'opportunity' ? '#007AFF' : '#fff',
              alignItems: 'center',
              borderLeftWidth: 1,
              borderLeftColor: '#E5E5EA'
            }}
          >
            <Text style={{ 
              fontSize: 16,
              color: type === 'opportunity' ? '#fff' : '#3C3C43',
              fontWeight: type === 'opportunity' ? 'bold' : 'normal'
            }}>💼 Opportunity</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#3C3C43' }}>
          Title *
        </Text>
        <TextInput
          placeholder={type === 'service' ? 'e.g., Professional Piano Lessons' : 'e.g., Marketing Intern Needed'}
          value={title}
          onChangeText={setTitle}
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#E5E5EA',
            padding: 14,
            marginBottom: 16,
            borderRadius: 8,
            fontSize: 16
          }}
        />

        {/* Category */}
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#3C3C43' }}>
          Category *
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                marginRight: 8,
                backgroundColor: category === cat ? '#007AFF' : '#fff',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: category === cat ? '#007AFF' : '#E5E5EA',
              }}
            >
              <Text style={{ 
                color: category === cat ? '#fff' : '#3C3C43',
                fontWeight: category === cat ? '600' : 'normal'
              }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Description */}
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#3C3C43' }}>
          Description *
        </Text>
        <TextInput
          placeholder="Describe your service or opportunity in detail..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#E5E5EA',
            padding: 14,
            marginBottom: 16,
            borderRadius: 8,
            fontSize: 16,
            minHeight: 120
          }}
        />

        {/* Price Range */}
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#3C3C43' }}>
          {type === 'service' ? 'Price Range *' : 'Compensation *'}
        </Text>
        <TextInput
          placeholder="e.g., 15,000 TZS/hour or Negotiable"
          value={priceRange}
          onChangeText={setPriceRange}
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#E5E5EA',
            padding: 14,
            marginBottom: 24,
            borderRadius: 8,
            fontSize: 16
          }}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleCreate}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#8E8E93' : '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 40
          }}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>
                Creating...
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Create Listing
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
