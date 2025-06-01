import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendMessageToOpenAI } from '../services/openai';

// Create the chat context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Provider component to wrap your app
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load conversation history when the component mounts
  useEffect(() => {
    loadMessages();
  }, []);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Load messages from AsyncStorage
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Add a welcome message if no previous messages exist
        setMessages([
          {
            id: '1',
            text: "Hi, I'm Sunny! I'm here to support you on your parenting journey. How can I help you today?",
            type: 'assistant',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load previous conversations');
    }
  };

  // Save messages to AsyncStorage
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (err) {
      console.error('Error saving messages:', err);
      setError('Failed to save conversation');
    }
  };

  // Send a message to the OpenAI API
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to the chat
    const userMessage = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Get only the last 10 messages to avoid exceeding token limits
      const recentMessages = messages.slice(-10);
      
      // Send to OpenAI
      const response = await sendMessageToOpenAI(text, recentMessages);

      // Add assistant response to the chat
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        type: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all messages
  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem('chatMessages');
      setMessages([
        {
          id: '1',
          text: "Hi, I'm Sunny! I'm here to support you on your parenting journey. How can I help you today?",
          type: 'assistant',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError('Failed to clear conversation');
    }
  };

  const value = {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
