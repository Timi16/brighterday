import { Image } from 'expo-image';
import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Message type definition
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Suggestion type definition
type Suggestion = {
  id: string;
  text: string;
};

// Sample suggestions
const initialSuggestions: Suggestion[] = [
  { id: '1', text: 'My child is crying at night' },
  { id: '2', text: 'Won\'t eat vegetables' },
  { id: '3', text: 'Help with sensory overload' },
  { id: '4', text: 'Communication tips' },
];

// Sunny's avatar component
const SunnyAvatar = ({ size = 40 }: { size?: number }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.sunnyAvatar, { width: size, height: size }]}>
      <ThemedView style={{
        backgroundColor: Colors.common.accent,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Sun rays */}
        <View style={styles.sunRays} />
      </ThemedView>
    </View>
  );
};

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const colorScheme = useColorScheme();
  const isUser = message.sender === 'user';
  
  return (
    <View style={[styles.messageBubbleContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
      {!isUser && <SunnyAvatar />}
      <View 
        style={[styles.messageBubble, 
          isUser ? styles.userMessage : styles.botMessage,
          { backgroundColor: isUser ? 
            Colors[colorScheme ?? 'light'].primary : 
            Colors[colorScheme ?? 'light'].card }
        ]}
      >
        <ThemedText style={isUser ? styles.userMessageText : styles.botMessageText}>
          {message.text}
        </ThemedText>
      </View>
    </View>
  );
};

// Suggestion button component
const SuggestionButton = ({ suggestion, onPress }: { suggestion: Suggestion, onPress: () => void }) => {
  const colorScheme = useColorScheme();
  
  return (
    <TouchableOpacity 
      style={[styles.suggestionButton, { borderColor: Colors[colorScheme ?? 'light'].primary }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <ThemedText style={styles.suggestionText}>{suggestion.text}</ThemedText>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m Sunny. How can I help you support your child today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const scrollViewRef = useRef<FlatList>(null);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Scroll to the bottom after bot responds
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  // Simple bot response logic (to be replaced with actual AI responses)
  const getBotResponse = (text: string): string => {
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText.includes('crying') || lowercaseText.includes('sleep')) {
      return 'Sleep disruptions can be challenging. Have you tried creating a consistent bedtime routine with visual schedules? These can help your child understand what to expect each night.';
    } else if (lowercaseText.includes('eat') || lowercaseText.includes('food') || lowercaseText.includes('vegetable')) {
      return 'Food selectivity is common. Try presenting new foods alongside favorites, using food bridges (similar foods), and keeping a relaxed attitude about eating. Would you like some specific strategies for vegetables?';
    } else if (lowercaseText.includes('sensory') || lowercaseText.includes('overload') || lowercaseText.includes('meltdown')) {
      return 'For sensory overload, creating a calm-down space with fidget toys, noise-canceling headphones, or weighted blankets can help. Would you like more specific ideas based on your child\'s sensory profile?';
    } else if (lowercaseText.includes('communication') || lowercaseText.includes('talk') || lowercaseText.includes('speak')) {
      return 'Communication happens in many ways! Visual supports, simple language, and following your child\'s lead can all help. What specific communication challenges are you facing?';
    } else {
      return 'Thank you for sharing. I\'m here to support you. Could you tell me more about what strategies you\'ve already tried?';
    }
  };

  // Handle pressing a suggestion
  const handleSuggestionPress = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <SunnyAvatar size={32} />
        <ThemedText type="subtitle" style={styles.headerTitle}>Chat with Sunny</ThemedText>
      </View>
      
      {/* Messages */}
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Suggestions */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map(suggestion => (
          <SuggestionButton 
            key={suggestion.id} 
            suggestion={suggestion} 
            onPress={() => handleSuggestionPress(suggestion)} 
          />
        ))}
      </ScrollView>
      
      {/* Input */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 16 }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: Colors[colorScheme ?? 'light'].input,
            color: Colors[colorScheme ?? 'light'].text
          }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].textSecondary}
          returnKeyType="send"
          onSubmitEditing={() => handleSendMessage(inputText)}
        />
        <TouchableOpacity 
          style={[styles.sendButton, { 
            backgroundColor: inputText.trim() ? Colors.common.teal : Colors[colorScheme ?? 'light'].border 
          }]}
          onPress={() => handleSendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Platform.select({
      ios: 'rgba(0,0,0,0.1)',
      default: '#E1E1E1'
    }),
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 18,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 8,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  botMessage: {
    borderBottomLeftRadius: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    // Using theme color defined in ThemedText
  },
  suggestionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sunnyAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunRays: {
    width: '70%',
    height: '70%',
    borderRadius: 100,
    backgroundColor: '#FFB347',
  }
});
