import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext({});

export const useChat = () => useContext(ChatContext);

const SOCKET_URL = 'http://localhost:3000'; // Your backend URL
const API_URL = 'http://localhost:3000/api';

export const ChatProvider = ({ children }) => {
  const { user, getToken } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL, {
        auth: { userId: user._id }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('new_message', (message) => {
        // Add new message to the active conversation
        if (activeConversation && message.chatId === activeConversation._id) {
          setMessages(prev => [...prev, message]);
        }
        // Update conversation list
        fetchConversations();
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/chats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Mock data for now
      setConversations([]);
    }
  };

  // Start a new conversation
  const startConversation = async (listingId, recipientId) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${API_URL}/chats/start`, {
        listingRef: listingId,
        recipientId: recipientId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await fetchConversations();
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId) => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${API_URL}/chats/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (conversationId, text) => {
    if (!text.trim() || !socket) return;

    const messageData = {
      chatId: conversationId,
      senderId: user._id,
      text: text.trim(),
      timestamp: new Date()
    };

    // Optimistic update
    setMessages(prev => [...prev, { ...messageData, _id: 'temp-' + Date.now() }]);

    // Emit via socket
    socket.emit('send_message', messageData);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      setActiveConversation,
      fetchConversations,
      startConversation,
      loadMessages,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
