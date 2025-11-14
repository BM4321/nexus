import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { startConversation } = useChat();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      // Use mock data for now
      setListing(getMockListing());
    } finally {
      setLoading(false);
    }
  };

  const getMockListing = () => ({
    _id: id,
    title: 'Professional Piano Lessons',
    description: 'I offer professional piano lessons for beginners and intermediate students. With 10 years of experience teaching music, I can help you learn to play your favorite songs and develop proper technique. Lessons are tailored to your skill level and musical interests.\n\nWhat you\'ll learn:\n- Proper hand positioning and posture\n- Reading sheet music\n- Music theory basics\n- Your favorite songs and pieces\n- Performance techniques\n\nLessons available:\n- One-on-one sessions\n- Group classes (up to 4 students)\n- Online or in-person\n\nLocation: Arusha, Tanzania',
    category: 'Music',
    priceRange: '15,000 TZS/hour',
    type: 'service',
    status: 'active',
    createdAt: new Date(),
    userRef: {
      _id: 'user123',
      name: 'John Musician',
      email: 'john@example.com',
      avgRating: 4.8,
      phone: '+255 123 456 789'
    }
  });

  const handleContact = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to contact this user', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/login') }
      ]);
      return;
    }

    // Show loading alert
    Alert.alert(
      'Start Conversation',
      `Do you want to start a chat about "${listing.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Chat',
          onPress: async () => {
            try {
              // Try to start conversation via API
              const conversation = await startConversation(listing._id, listing.userRef._id);
              
              if (conversation) {
                router.push(`/chat/${conversation._id}`);
              } else {
                // Fallback: Show contact info
                Alert.alert(
                  'Contact Information',
                  `Name: ${listing.userRef.name}\nEmail: ${listing.userRef.email}\nPhone: ${listing.userRef.phone || 'Not provided'}\n\nNote: Real-time chat will be available once the backend is fully configured.`,
                  [
                    { text: 'OK' }
                  ]
                );
              }
            } catch (error) {
              console.error('Contact error:', error);
              // Fallback: Show contact info
              Alert.alert(
                'Contact Information',
                `Name: ${listing.userRef.name}\nEmail: ${listing.userRef.email}\nPhone: ${listing.userRef.phone || 'Not provided'}\n\nNote: Real-time chat will be available once the backend is fully configured.`,
                [
                  { text: 'OK' }
                ]
              );
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>❌</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Listing Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 16, backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwnListing = user?._id === listing.userRef._id;

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <ScrollView>
        {/* Header */}
        <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            <Text style={{ fontSize: 16, color: '#007AFF' }}>← Back</Text>
          </TouchableOpacity>

          <View style={{ 
            backgroundColor: listing.type === 'service' ? '#E3F2FD' : '#FFF3E0',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            alignSelf: 'flex-start',
            marginBottom: 12
          }}>
            <Text style={{ 
              fontSize: 12,
              fontWeight: '600',
              color: listing.type === 'service' ? '#1976D2' : '#F57C00'
            }}>
              {listing.type === 'service' ? '🎯 Service' : '💼 Opportunity'}
            </Text>
          </View>

          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>
            {listing.title}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#8E8E93', marginRight: 12 }}>
              📂 {listing.category}
            </Text>
            <Text style={{ fontSize: 14, color: '#8E8E93' }}>
              📅 Posted {new Date(listing.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007AFF' }}>
            {listing.priceRange}
          </Text>
        </View>

        {/* Seller Info */}
        <View style={{ backgroundColor: '#fff', marginTop: 12, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            {listing.type === 'service' ? 'Service Provider' : 'Posted By'}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                {listing.userRef.name}
              </Text>
              {listing.userRef.avgRating && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, marginRight: 4 }}>⭐</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF9500' }}>
                    {listing.userRef.avgRating}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#8E8E93', marginLeft: 4 }}>
                    (12 reviews)
                  </Text>
                </View>
              )}
            </View>

            {!isOwnListing && (
              <TouchableOpacity
                onPress={handleContact}
                style={{
                  backgroundColor: '#007AFF',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 8
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={{ backgroundColor: '#fff', marginTop: 12, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Description
          </Text>
          <Text style={{ fontSize: 16, lineHeight: 24, color: '#3C3C43' }}>
            {listing.description}
          </Text>
        </View>

        {/* Location */}
        <View style={{ backgroundColor: '#fff', marginTop: 12, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Location
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>📍</Text>
            <Text style={{ fontSize: 16, color: '#3C3C43' }}>
              Arusha, Tanzania
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {!isOwnListing && (
        <View style={{ 
          backgroundColor: '#fff', 
          padding: 20, 
          borderTopWidth: 1, 
          borderTopColor: '#E5E5EA',
          flexDirection: 'row',
          gap: 12
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#F2F2F7',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#3C3C43' }}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleContact}
            style={{
              flex: 2,
              backgroundColor: '#007AFF',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              Contact Seller
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
