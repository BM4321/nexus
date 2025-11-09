import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function BrowseScreen() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');

  const categories = ['All', 'Music', 'IT', 'Construction', 'Marketing', 'Education', 'Design', 'Writing', 'Other'];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchQuery, selectedCategory, selectedType, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/listings`);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Use mock data
      setListings(getMockListings());
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(listing => listing.type === selectedType);
    }

    setFilteredListings(filtered);
  };

  const getMockListings = () => [
    {
      _id: '1',
      title: 'Piga Kinanda Lessons',
      description: 'Professional piano lessons for beginners and intermediate students',
      category: 'Music',
      priceRange: '15,000 TZS/hour',
      type: 'service',
      userRef: { name: 'John Musician', avgRating: 4.8 }
    },
    {
      _id: '2',
      title: 'Web Development Services',
      description: 'Full-stack web development for small businesses',
      category: 'IT',
      priceRange: 'From 500,000 TZS',
      type: 'service',
      userRef: { name: 'Sarah Developer', avgRating: 4.9 }
    },
    {
      _id: '3',
      title: 'Marketing Intern Needed',
      description: 'Looking for enthusiastic marketing intern for 3-month program',
      category: 'Marketing',
      priceRange: 'Negotiable',
      type: 'opportunity',
      userRef: { name: 'TechCorp Ltd', avgRating: 4.5 }
    },
  ];

  const ListingCard = ({ listing }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
          Browse Listings
        </Text>

        {/* Search Bar */}
        <TextInput
          placeholder="Search services or opportunities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: '#F2F2F7',
            padding: 12,
            borderRadius: 10,
            fontSize: 16,
            marginBottom: 16
          }}
        />

        {/* Type Filter */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setSelectedType('all')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: selectedType === 'all' ? '#007AFF' : '#F2F2F7',
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ 
              color: selectedType === 'all' ? '#fff' : '#3C3C43',
              fontWeight: selectedType === 'all' ? 'bold' : 'normal'
            }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType('service')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: selectedType === 'service' ? '#007AFF' : '#F2F2F7',
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ 
              color: selectedType === 'service' ? '#fff' : '#3C3C43',
              fontWeight: selectedType === 'service' ? 'bold' : 'normal'
            }}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType('opportunity')}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 16,
              backgroundColor: selectedType === 'opportunity' ? '#007AFF' : '#F2F2F7',
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ 
              color: selectedType === 'opportunity' ? '#fff' : '#3C3C43',
              fontWeight: selectedType === 'opportunity' ? 'bold' : 'normal'
            }}>Opportunities</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 12, paddingLeft: 20, maxHeight: 50 }}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
              backgroundColor: selectedCategory === cat ? '#007AFF' : '#fff',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: selectedCategory === cat ? '#007AFF' : '#E5E5EA',
            }}
          >
            <Text style={{ 
              color: selectedCategory === cat ? '#fff' : '#3C3C43',
              fontWeight: selectedCategory === cat ? '600' : 'normal'
            }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <Text style={{ fontSize: 14, color: '#8E8E93', marginBottom: 12 }}>
          {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''} found
        </Text>

        {filteredListings.length === 0 ? (
          <View style={{ 
            backgroundColor: '#fff', 
            padding: 40, 
            borderRadius: 12, 
            alignItems: 'center',
            marginTop: 20
          }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>No results found</Text>
            <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          filteredListings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}
