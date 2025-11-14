import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:3000/api';
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, getToken } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    nearbyListings: 0,
    activeChats: 0,
    userListings: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch listings
      const listingsResponse = await axios.get(`${API_URL}/listings`);
      const allListings = listingsResponse.data;
      
      // Fetch user's listings
      let userListingsData = [];
      if (user && getToken) {
        try {
          const token = await getToken();
          if (token) {
            const userListingsResponse = await axios.get(`${API_URL}/listings/user/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            userListingsData = userListingsResponse.data;
          }
        } catch (err) {
          console.log('Could not fetch user listings:', err.message);
        }
      }

      // Calculate statistics
      setStats({
        totalListings: allListings.length,
        nearbyListings: allListings.filter(l => l.location).length,
        activeChats: 0,
        userListings: userListingsData.length
      });

      // Get recent listings (last 5)
      setRecentListings(allListings.slice(0, 5));

      // Calculate category distribution
      const categoryCounts = {};
      allListings.forEach(listing => {
        categoryCounts[listing.category] = (categoryCounts[listing.category] || 0) + 1;
      });
      
      const categories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
      
      setFeaturedCategories(categories);

    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'IT': '💻',
      'Construction': '🏗️',
      'Marketing': '📱',
      'Education': '📚',
      'Design': '🎨',
      'Writing': '✍️',
      'Other': '🔧'
    };
    return icons[category] || '📦';
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: color,
        minHeight: 100,
        justifyContent: 'space-between'
      }}
    >
      <View>
        <Text style={{ fontSize: 32, marginBottom: 4 }}>{icon}</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3C3C43', marginBottom: 4 }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: '#8E8E93', fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const CategoryCard = ({ category }) => (
    <TouchableOpacity
      onPress={() => router.push('/(tabs)/browse')}
      style={{
        width: (width - 48) / 2,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA'
      }}
    >
      <Text style={{ fontSize: 32, marginBottom: 8 }}>{getCategoryIcon(category.name)}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{category.name}</Text>
      <Text style={{ fontSize: 12, color: '#8E8E93' }}>{category.count} listing{category.count !== 1 ? 's' : ''}</Text>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <Text style={{ fontSize: 40, marginRight: 16 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
          {description}
        </Text>
      </View>
      <Text style={{ fontSize: 24, color: '#fff' }}>→</Text>
    </TouchableOpacity>
  );

  const ListingPreviewCard = ({ listing }) => (
    <TouchableOpacity
      onPress={() => router.push(`/listing/${listing._id}`)}
      style={{
        width: width - 60,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA'
      }}
    >
      <View style={{
        backgroundColor: listing.type === 'service' ? '#E3F2FD' : '#FFF3E0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8
      }}>
        <Text style={{
          fontSize: 10,
          fontWeight: '600',
          color: listing.type === 'service' ? '#1976D2' : '#F57C00'
        }}>
          {listing.type === 'service' ? '🎯 SERVICE' : '💼 OPPORTUNITY'}
        </Text>
      </View>
      
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }} numberOfLines={1}>
        {listing.title}
      </Text>
      
      <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 8 }} numberOfLines={2}>
        {listing.description}
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#007AFF' }}>
          {listing.priceRange}
        </Text>
        <Text style={{ fontSize: 12, color: '#8E8E93' }}>
          {listing.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: '#8E8E93' }}>Loading your dashboard...</Text>
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
        {/* Hero Header */}
        <View style={{ 
          backgroundColor: '#007AFF', 
          paddingTop: 60, 
          paddingHorizontal: 20, 
          paddingBottom: 30,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24
        }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>
            Welcome, {user?.name?.split(' ')[0] || 'User'}! 👋
          </Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
            {user?.role === 'talent' 
              ? 'Discover opportunities and showcase your skills' 
              : 'Find talented professionals for your projects'}
          </Text>

          {/* Stats Grid */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <StatCard
              title="Total Listings"
              value={stats.totalListings}
              icon="📊"
              color="#34C759"
              onPress={() => router.push('/(tabs)/browse')}
            />
            <StatCard
              title={user?.role === 'talent' ? 'My Listings' : 'Posted'}
              value={stats.userListings}
              icon="📝"
              color="#FF9500"
              onPress={() => router.push('/(tabs)/profile')}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
            Quick Actions
          </Text>
          
          <QuickActionCard
            title="Browse All Listings"
            description="Explore services and opportunities near you"
            icon="🔍"
            color="#5856D6"
            onPress={() => router.push('/(tabs)/browse')}
          />

          <QuickActionCard
            title={user?.role === 'talent' ? 'Offer Your Service' : 'Post Opportunity'}
            description={user?.role === 'talent' 
              ? 'Share your skills with the community' 
              : 'Find the perfect talent for your project'}
            icon="➕"
            color="#FF2D55"
            onPress={() => router.push('/(tabs)/create')}
          />

          {stats.activeChats > 0 && (
            <QuickActionCard
              title="Active Conversations"
              description={`You have ${stats.activeChats} ongoing chat${stats.activeChats !== 1 ? 's' : ''}`}
              icon="💬"
              color="#32ADE6"
              onPress={() => router.push('/(tabs)/chats')}
            />
          )}
        </View>

        {/* Popular Categories */}
        {featuredCategories.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
              Popular Categories
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {featuredCategories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </View>
          </View>
        )}

        {/* Recent Listings */}
        {recentListings.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                Recent Listings
              </Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/browse')}>
                <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: '600' }}>See All →</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {recentListings.map((listing) => (
                <ListingPreviewCard key={listing._id} listing={listing} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Platform Info Banner */}
        <View style={{ 
          marginHorizontal: 20, 
          marginBottom: 20, 
          backgroundColor: '#fff', 
          padding: 20, 
          borderRadius: 16,
          borderWidth: 2,
          borderColor: '#007AFF'
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            Welcome to Nexus 🚀
          </Text>
          <Text style={{ fontSize: 14, color: '#3C3C43', lineHeight: 20, marginBottom: 12 }}>
            Connect with talented professionals and discover opportunities in your community. 
            Nexus makes it easy to monetize your skills or find the perfect person for your project.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, backgroundColor: '#F2F2F7', padding: 12, borderRadius: 8 }}>
              <Text style={{ fontSize: 24, marginBottom: 4 }}>✅</Text>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>Verified Users</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#F2F2F7', padding: 12, borderRadius: 8 }}>
              <Text style={{ fontSize: 24, marginBottom: 4 }}>💬</Text>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>Real-Time Chat</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#F2F2F7', padding: 12, borderRadius: 8 }}>
              <Text style={{ fontSize: 24, marginBottom: 4 }}>📍</Text>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>Local Network</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
