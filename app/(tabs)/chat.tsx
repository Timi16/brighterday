import { Image } from 'expo-image';
import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppState } from '@/hooks/useAppState';

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

// Initial suggestions based on the flow
const initialSuggestions: Suggestion[] = [
  { id: '1', text: "How do I stop a meltdown?" },
  { id: '2', text: "What's a good reward system?" },
  { id: '3', text: "My child won't go to sleep." },
  { id: '4', text: "How to improve communication?" },
];

// Sunny's avatar component
const SunnyAvatar = ({ size = 40 }: { size?: number }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.sunnyAvatar, { width: size, height: size }]}>
      <View style={{
        backgroundColor: Colors.common.accent,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Sun rays */}
        {Array(8).fill(0).map((_, i) => (
          <View 
            key={`ray-${i}`} 
            style={[
              styles.sunRay, 
              { 
                backgroundColor: Colors.common.accent,
                transform: [{ rotate: `${i * 45}deg` }],
                width: size * 0.08,
                height: size * 0.2,
                top: -size * 0.08,
                left: size * 0.46,
                borderRadius: size * 0.04,
              }
            ]} 
          />
        ))}
        
        {/* Sun face */}
        <View style={styles.sunFace}>
          {/* Eyes */}
          <View style={styles.eyesContainer}>
            <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
            <View style={[styles.eye, { width: size * 0.1, height: size * 0.1 }]} />
          </View>
          
          {/* Smile */}
          <View style={[
            styles.smile, 
            { 
              width: size * 0.4, 
              height: size * 0.2, 
              borderBottomWidth: Math.max(2, size * 0.03)
            }
          ]} />
        </View>
      </View>
    </View>
  );
};

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const colorScheme = useColorScheme();
  const isUser = message.sender === 'user';
  
  return (
    <View style={[
      styles.messageBubbleContainer,
      isUser ? styles.userMessageContainer : styles.botMessageContainer,
    ]}>
      {!isUser && <SunnyAvatar />}
      <View style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.botMessage,
        { backgroundColor: isUser ? Colors.common.primary : Colors[colorScheme || 'light'].cardBackground }
      ]}>
        <ThemedText style={[
          styles.messageText,
          isUser && { color: 'white' }
        ]}>
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
      style={[
        styles.suggestionButton,
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.cardBackground : Colors.light.cardBackground }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ThemedText style={styles.suggestionText}>{suggestion.text}</ThemedText>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { state } = useAppState();
  
  // Generate initial message based on user selections
  const getInitialMessage = () => {
    let greeting = "Hi! I'm Sunny, your daily helper. How can I support you today?";
    
    if (state.focusArea) {
      const focusAreaMap: Record<string, string> = {
        'meltdowns': 'managing meltdowns',
        'potty': 'potty training',
        'communication': 'communication skills',
        'sleep': 'sleep challenges',
        'eating': 'picky eating',
        'directions': 'following directions',
        'other': 'your specific challenges',
        'unsure': 'finding the right strategies'
      };
      
      const area = state.focusArea;
      if (area && focusAreaMap[area]) {
        greeting = `Hi! I'm Sunny, your daily helper. I see you'd like help with ${focusAreaMap[area]}. What specific challenges are you facing?`;
      }
    }
    
    return greeting;
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getInitialMessage(),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const listRef = useRef<FlatList>(null);
  
  // Function to handle sending a message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add to messages
    setMessages(prev => [...prev, newUserMessage]);
    
    // Clear input
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Scroll to bottom
      if (listRef.current) {
        listRef.current.scrollToEnd({ animated: true });
      }
    }, 1000);
  };
  
  // Function to get bot response (placeholder)
  const getBotResponse = (userMessage: string): string => {
    // This would be replaced with actual AI logic
    if (userMessage.toLowerCase().includes('meltdown')) {
      return "When your child is having a meltdown, try to stay calm and give them space. Remove overwhelming stimuli and offer comfort without pressuring them. Remember that a meltdown is not a choice - it's an expression of overwhelm. Would you like specific steps to follow during a meltdown?";
    } else if (userMessage.toLowerCase().includes('sleep') || userMessage.toLowerCase().includes('won\'t go to sleep')) {
      return "Sleep challenges are common. Try creating a consistent bedtime routine with visual supports. Gradually introducing relaxation techniques before bed can help. Would you like to know more about creating a calm sleep environment?";
    } else if (userMessage.toLowerCase().includes('reward')) {
      return "Effective reward systems focus on positive reinforcement. Try a token board where your child earns tokens for desired behaviors, which can be exchanged for preferred activities. Keep rewards immediate at first, and be consistent. Would you like help setting up a token system?";
    } else if (userMessage.toLowerCase().includes('communication')) {
      return "To improve communication, try using visual supports, simple language, and giving extra processing time. Model the communication skills you'd like to see. Augmentative communication tools can also help bridge gaps. Would you like specific communication strategies for your child's age?";
    } else {
      return "Thank you for sharing. I'm here to help with practical strategies tailored to your needs. Could you tell me more about the specific situation you're experiencing?";
    }
  };
  
  // Handle suggestion press
  const handleSuggestionPress = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text);
    
    // Update suggestions based on context
    const newSuggestions = [
      { id: '5', text: 'Tell me more about that' },
      { id: '6', text: 'How do I start?' },
      { id: '7', text: 'Need visual resources' },
      { id: '8', text: 'That didn\'t work for us' },
    ];
    
    setSuggestions(newSuggestions);
  };
  
  // Render message item
  const renderMessageItem = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );
  
  return (
    <ThemedView style={styles.container}>
      <View style={[
        styles.header,
        { 
          paddingTop: insets.top || 20,
          borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }
      ]}>
        <View style={styles.headerContent}>
          <SunnyAvatar size={36} />
          <ThemedText style={styles.headerTitle}>Chat with Sunny</ThemedText>
        </View>
      </View>
      
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.messagesList,
          { paddingBottom: 100 }
        ]}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={[
        styles.disclaimerContainer,
        { backgroundColor: colorScheme === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)' }
      ]}>
        <ThemedText style={styles.disclaimerText}>
          Sunny is not a licensed provider. For clinical advice, please consult a professional.
        </ThemedText>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        style={[
          styles.inputContainer,
          { 
            paddingBottom: insets.bottom || 20,
            backgroundColor: colorScheme === 'dark' ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
            borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }
        ]}
      >
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
        
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colorScheme === 'dark' ? Colors.dark.cardBackground : Colors.light.cardBackground,
                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: colorScheme === 'dark' ? 'white' : 'black'
              }
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Sunny..."
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#777'}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: Colors.common.primary,
                opacity: input.trim() ? 1 : 0.6
              }
            ]}
            onPress={() => handleSendMessage(input)}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.sendButtonText}>→</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sunnyAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunRay: {
    position: 'absolute',
  },
  sunFace: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%',
    marginBottom: 5,
  },
  eye: {
    borderRadius: 10,
    backgroundColor: '#8B4513',
  },
  smile: {
    borderBottomColor: '#8B4513',
    borderRadius: 10,
  },
  messagesList: {
    padding: 16,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  botMessage: {
    marginLeft: 8,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  suggestionsContainer: {
    paddingBottom: 12,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    minHeight: 50,
  },
  sendButton: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disclaimerContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  disclaimerText: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  }
});
