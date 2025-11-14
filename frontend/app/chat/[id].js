import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { messages, loading, loadMessages, sendMessage, setActiveConversation } = useChat();
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (id) {
      setActiveConversation({ _id: id });
      loadMessages(id);
    }

    return () => {
      setActiveConversation(null);
    };
  }, [id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(id, messageText);
      setMessageText('');
    }
  };

  const MessageBubble = ({ message }) => {
    const isMyMessage = message.senderId === user?._id;

    return (
      <View style={{
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isMyMessage ? '#007AFF' : '#E5E5EA',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 8,
        maxWidth: '75%'
      }}>
        <Text style={{ 
          fontSize: 16, 
          color: isMyMessage ? '#fff' : '#3C3C43' 
        }}>
          {message.text}
        </Text>
        <Text style={{ 
          fontSize: 10, 
          color: isMyMessage ? 'rgba(255,255,255,0.7)' : '#8E8E93',
          marginTop: 4 
        }}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
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
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F2F2F7' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={{ 
        backgroundColor: '#fff', 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA'
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 8 }}
        >
          <Text style={{ fontSize: 16, color: '#007AFF' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chat</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>👋</Text>
            <Text style={{ fontSize: 16, color: '#8E8E93' }}>No messages yet. Say hi!</Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        )}
      </ScrollView>

      {/* Input */}
      <View style={{ 
        backgroundColor: '#fff', 
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        flexDirection: 'row',
        gap: 8
      }}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          style={{
            flex: 1,
            backgroundColor: '#F2F2F7',
            padding: 12,
            borderRadius: 20,
            fontSize: 16
          }}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!messageText.trim()}
          style={{
            backgroundColor: messageText.trim() ? '#007AFF' : '#E5E5EA',
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 20 }}>⬆️</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
