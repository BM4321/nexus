import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import React from 'react';

const API_URL = 'http://localhost:3000/api';

export default function ProfileScreen() {
  const { user, logout, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'listings'
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');

  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'listings') {
        fetchMyListings();
      }
    }, [activeTab])
  );

  const fetchMyListings = async () => {
    try {
      setListingsLoading(true);
      const token = await getToken();
      const response = await axios.get(`${API_URL}/listings/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Mock data for now
      setMyListings(getMockMyListings());
    } finally {
      setListingsLoading(false);
    }
  };

  const getMockMyListings = () => [
    {
      _id: '1',
      title: 'My Service Listing',
      description: 'This is my listing',
      category: 'IT',
      priceRange: '50,000 TZS',
      type: 'service',
      status: 'active',
      createdAt: new Date()
    }
  ];

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const updateData = {
        name,
        phone,
        bio,
        skills: skills.split(',').map(s => s.trim()).filter(s => s)
      };

      await axios.put(`${API_URL}/users/profile`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = (listingId) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${API_URL}/listings/${listingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              Alert.alert('Success', 'Listing deleted successfully');
              fetchMyListings();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete listing');
            }
          }
        }
      ]
    );
  };

  const handleToggleStatus = async (listingId, currentStatus) => {
    try {
      const token = await getToken();
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      await axios.patch(`${API_URL}/listings/${listingId}`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      Alert.alert('Success', `Listing ${newStatus === 'active' ? 'activated' : 'paused'}`);
      fetchMyListings();
    } catch (error) {
      console.error('Toggle status error:', error);
      Alert.alert('Error', 'Failed to update listing status');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const MyListingCard = ({ listing }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#E5E5EA',
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>
              {listing.title}
            </Text>
            <View style={{
              backgroundColor: listing.status === 'active' ? '#34C759' : '#FF9500',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'white' }}>
                {listing.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 8 }}>
            {listing.category} • {listing.type === 'service' ? '🎯 Service' : '💼 Opportunity'}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, color: '#3C3C43', marginBottom: 12 }} numberOfLines={2}>
        {listing.description}
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#007AFF', marginBottom: 12 }}>
        {listing.priceRange}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          onPress={() => router.push(`/listing/${listing._id}`)}
          style={{
            flex: 1,
            backgroundColor: '#F2F2F7',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#3C3C43' }}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleToggleStatus(listing._id, listing.status)}
          style={{
            flex: 1,
            backgroundColor: listing.status === 'active' ? '#FF9500' : '#34C759',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
            {listing.status === 'active' ? 'Pause' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteListing(listing._id)}
          style={{
            flex: 1,
            backgroundColor: '#FF3B30',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
          Profile
        </Text>

        {/* Tab Selector */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            style={{
              flex: 1,
              paddingVertical: 10,
              backgroundColor: activeTab === 'profile' ? '#007AFF' : '#F2F2F7',
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: activeTab === 'profile' ? '#fff' : '#3C3C43',
              fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
            }}>
              Profile Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setActiveTab('listings');
              fetchMyListings();
            }}
            style={{
              flex: 1,
              paddingVertical: 10,
              backgroundColor: activeTab === 'listings' ? '#007AFF' : '#F2F2F7',
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: activeTab === 'listings' ? '#fff' : '#3C3C43',
              fontWeight: activeTab === 'listings' ? 'bold' : 'normal'
            }}>
              My Listings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {activeTab === 'profile' ? (
          /* Profile Tab */
          <View style={{ padding: 20 }}>
            {/* Basic Info Card */}
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Basic Information
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditing(!isEditing)}
                  style={{
                    backgroundColor: isEditing ? '#FF3B30' : '#007AFF',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Name */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E5EA',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    marginBottom: 16
                  }}
                />
              ) : (
                <Text style={{ fontSize: 16, marginBottom: 16 }}>{name || 'Not set'}</Text>
              )}

              {/* Email (read-only) */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Email</Text>
              <Text style={{ fontSize: 16, marginBottom: 16, color: '#8E8E93' }}>{user?.email}</Text>

              {/* Role (read-only) */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Role</Text>
              <Text style={{ fontSize: 16, marginBottom: 16, textTransform: 'capitalize' }}>
                {user?.role || 'N/A'}
              </Text>

              {/* Phone */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+255 123 456 789"
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E5EA',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    marginBottom: 16
                  }}
                />
              ) : (
                <Text style={{ fontSize: 16, marginBottom: 16 }}>{phone || 'Not set'}</Text>
              )}

              {/* Bio */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Bio</Text>
              {isEditing ? (
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E5EA',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    marginBottom: 16,
                    minHeight: 100
                  }}
                />
              ) : (
                <Text style={{ fontSize: 16, marginBottom: 16 }}>{bio || 'Not set'}</Text>
              )}

              {/* Skills */}
              <Text style={{ fontSize: 12, color: '#8E8E93', marginBottom: 4 }}>Skills (comma separated)</Text>
              {isEditing ? (
                <TextInput
                  value={skills}
                  onChangeText={setSkills}
                  placeholder="e.g., Piano, Guitar, Music Theory"
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E5EA',
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 16,
                    marginBottom: 16
                  }}
                />
              ) : (
                <Text style={{ fontSize: 16, marginBottom: 16 }}>{skills || 'Not set'}</Text>
              )}

              {/* Save Button */}
              {isEditing && (
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  disabled={loading}
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#FF3B30'
              }}
            >
              <Text style={{ color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* My Listings Tab */
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
              My Listings ({myListings.length})
            </Text>

            {listingsLoading ? (
              <View style={{ alignItems: 'center', padding: 40 }}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : myListings.length === 0 ? (
              <View style={{
                backgroundColor: '#fff',
                padding: 40,
                borderRadius: 12,
                alignItems: 'center'
              }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>📝</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                  No listings yet
                </Text>
                <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 16 }}>
                  Create your first listing to get started
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/create')}
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Create Listing</Text>
                </TouchableOpacity>
              </View>
            ) : (
              myListings.map((listing) => (
                <MyListingCard key={listing._id} listing={listing} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
