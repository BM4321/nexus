import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useChat } from '../../context/ChatContext';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';

export default function ChatsScreen() {
  const { conversations, fetchConversations, loading } = useChat();

  useFocusEffect(
    React.useCallback(() => {
      fetchConversations();
    }, [])
  );

  const ConversationCard = ({ conversation }) => {
    const otherUser = conversation.participants?.find(p => p._id !== conversation.currentUserId);
    const lastMessage = conversation.messages?.[conversation.messages.length - 1];

    return (
      <TouchableOpacity
        onPress={() => router.push(`/chat/${conversation._id}`)}
        style={{
          backgroundColor: '#fff',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5EA'
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1 }}>
            {otherUser?.name || 'Unknown User'}
          </Text>
          {lastMessage && (
            <Text style={{ fontSize: 12, color: '#8E8E93' }}>
              {new Date(lastMessage.timestamp).toLocaleDateString()}
            </Text>
          )}
        </View>

        <Text style={{ fontSize: 14, color: '#3C3C43', marginBottom: 4 }}>
          Re: {conversation.listingRef?.title || 'Listing'}
        </Text>

        {lastMessage && (
          <Text style={{ fontSize: 14, color: '#8E8E93' }} numberOfLines={1}>
            {lastMessage.text}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>💬</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>No conversations yet</Text>
          <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
            Start a conversation by contacting a seller from their listing
          </Text>
        </View>
      ) : (
        <ScrollView>
          {conversations.map((conversation) => (
            <ConversationCard key={conversation._id} conversation={conversation} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
