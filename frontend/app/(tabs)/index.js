import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:3000/api';

export default function HomeScreen() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchListings();
    }, [])
  );

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings`);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(getMockListings());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const getMockListings = () => [
    {
      _id: '1',
      title: 'Piga Kinanda Lessons',
      description: 'Professional piano lessons for beginners and intermediate students',
      category: 'Music',
      priceRange: '15,000 TZS/hour',
      type: 'service',
      location: { coordinates: [36.68, -3.38] },
      userRef: { name: 'John Musician', avgRating: 4.8 }
    },
    {
      _id: '2',
      title: 'Web Development Services',
      description: 'Full-stack web development for small businesses',
      category: 'IT',
      priceRange: 'From 500,000 TZS',
      type: 'service',
      location: { coordinates: [36.68, -3.38] },
      userRef: { name: 'Sarah Developer', avgRating: 4.9 }
    },
    {
      _id: '3',
      title: 'Marketing Intern Needed',
      description: 'Looking for enthusiastic marketing intern for 3-month program',
      category: 'Marketing',
      priceRange: 'Negotiable',
      type: 'opportunity',
      location: { coordinates: [36.68, -3.38] },
      userRef: { name: 'TechCorp Ltd', avgRating: 4.5 }
    },
  ];

  const ListingCard = ({ listing }) => (
    <TouchableOpacity
      onPress={() => router.push(`/listing/${listing._id}`)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
            {listing.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 8 }}>
            {listing.category} • {listing.type === 'service' ? '🎯 Service' : '💼 Opportunity'}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, color: '#3C3C43', marginBottom: 12 }} numberOfLines={2}>
        {listing.description}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#007AFF' }}>
          {listing.priceRange}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#8E8E93', marginRight: 4 }}>
            {listing.userRef?.name}
          </Text>
          {listing.userRef?.avgRating && (
            <Text style={{ fontSize: 12, color: '#FF9500' }}>
              ⭐ {listing.userRef.avgRating}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: '#8E8E93' }}>Loading opportunities...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </Text>
          <Text style={{ fontSize: 16, color: '#8E8E93' }}>
            {user?.role === 'talent' ? 'Find opportunities near you' : 'Discover talented professionals'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            padding: 16, 
            borderRadius: 12, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E5EA',
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF' }}>{listings.length}</Text>
            <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>Active Listings</Text>
          </View>
          <View style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            padding: 16, 
            borderRadius: 12, 
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E5EA',
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#34C759' }}>12</Text>
            <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>Nearby</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            {user?.role === 'talent' ? 'Opportunities for You' : 'Available Services'}
          </Text>
          
          {listings.length === 0 ? (
            <View style={{ 
              backgroundColor: '#fff', 
              padding: 40, 
              borderRadius: 12, 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E5E5EA',
            }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>No listings yet</Text>
              <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
                Be the first to create a listing in your area!
              </Text>
            </View>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
