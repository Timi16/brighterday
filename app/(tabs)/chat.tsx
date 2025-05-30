import { Image } from 'expo-image';
import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, FlatList, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
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
  return (
    <View style={[styles.sunnyAvatar, { width: size, height: size }]}>
      <View style={{
        backgroundColor: '#FFDB58', // Sunny yellow color
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
                backgroundColor: '#FFDB58', // Match sun color
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
          
          {/* Neutral mouth */}
          <View style={[
            styles.smile, 
            { 
              width: size * 0.4, 
              height: size * 0.1, 
              borderBottomWidth: Math.max(1.5, size * 0.02)
            }
          ]} />
        </View>
      </View>
    </View>
  );
};

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
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
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

// Suggestion button component
const SuggestionButton = ({ suggestion, onPress }: { suggestion: Suggestion, onPress: () => void }) => {
  return (
    <TouchableOpacity
      style={styles.suggestionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.suggestionText}>{suggestion.text}</Text>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.backgroundPattern}>
        <Image
          source={require('../../assets/images/sun-pattern.png')}
          style={styles.patternImage}
          contentFit="cover"
          cachePolicy="memory"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{ flex: 1, paddingTop: insets.top + 10, paddingBottom: insets.bottom }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat with Sunny</Text>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ask Sunny..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
                onSubmitEditing={() => handleSendMessage(input)}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !input.trim() && styles.sendButtonDisabled,
                ]}
                onPress={() => handleSendMessage(input)}
                disabled={!input.trim()}
                activeOpacity={0.7}
              >
                <Ionicons name="send" size={22} color={input.trim() ? Colors.common.teal : '#ccc'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion) => (
              <SuggestionButton
                key={suggestion.id}
                suggestion={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm white background like in Image 3
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
    zIndex: -1,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  sunnyAvatar: {
    marginRight: 5,
  },
  sunFace: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 5,
  },
  eye: {
    backgroundColor: '#8B4513', // Brown eyes
    borderRadius: 4,
  },
  smile: {
    borderBottomColor: '#8B4513', // Brown smile
    borderRadius: 10,
  },
  sunRay: {
    position: 'absolute',
  },
  suggestionButton: {
    margin: 5,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  suggestionText: {
    fontSize: 14,
    color: '#555555',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 10,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    borderBottomRightRadius: 4,
    marginLeft: 10,
    backgroundColor: Colors.common.teal,
  },
  botMessage: {
    borderBottomLeftRadius: 4,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333333',
  },
  inputContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    maxHeight: 120,
    color: '#333333',
  },
  sendButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
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
