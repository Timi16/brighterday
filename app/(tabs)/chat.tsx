import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Platform, 
  StyleSheet, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  FlatList, 
  View, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';
import { useChat } from '@/context/ChatContext';

// Message type definition for display (maps to the ChatContext message format)
type DisplayMessage = {
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
    <View style={{ marginRight: 8, width: size, height: size }}>
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
            style={{
              position: 'absolute',
              backgroundColor: '#FFDB58', // Match sun color
              transform: [{ rotate: `${i * 45}deg` }],
              width: size * 0.08,
              height: size * 0.2,
              top: -size * 0.08,
              left: size * 0.46,
              borderRadius: size * 0.04,
            }} 
          />
        ))}
        
        {/* Sun face */}
        <View style={{
          width: '60%',
          height: '60%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Eyes */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '60%',
            marginBottom: 8,
          }}>
            <View style={{ 
              width: size * 0.1, 
              height: size * 0.1,
              backgroundColor: '#8B4513', // Brown eyes
              borderRadius: size * 0.05,
            }} />
            <View style={{ 
              width: size * 0.1, 
              height: size * 0.1,
              backgroundColor: '#8B4513', // Brown eyes
              borderRadius: size * 0.05,
            }} />
          </View>
          
          {/* Neutral mouth */}
          <View style={{
            width: size * 0.4,
            height: size * 0.1,
            borderBottomWidth: Math.max(1.5, size * 0.02),
            borderBottomColor: '#8B4513', // Brown smile
            borderRadius: size * 0.2,
          }} />
        </View>
      </View>
    </View>
  );
};

// Message bubble component
const MessageBubble = ({ message }: { message: DisplayMessage }) => {
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
  const { messages: chatMessages, isLoading, error, sendMessage } = useChat();
  
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const listRef = useRef<FlatList>(null);
  
  // Convert chat context messages to display messages
  const displayMessages: DisplayMessage[] = chatMessages.map((msg: { id: string; text: string; type: string; timestamp: string }) => ({
    id: msg.id,
    text: msg.text,
    sender: msg.type === 'user' ? 'user' : 'bot',
    timestamp: new Date(msg.timestamp)
  }));
  
  // Update suggestions based on the latest message
  useEffect(() => {
    if (displayMessages.length > 1) {
      const latestMessage = displayMessages[displayMessages.length - 1];
      if (latestMessage.sender === 'bot') {
        // Customize suggestions based on message content
        let newSuggestions = [];
        const messageText = latestMessage.text.toLowerCase();
        
        if (messageText.includes('meltdown')) {
          newSuggestions = [
            { id: 'a1', text: 'How do I prevent meltdowns?' },
            { id: 'a2', text: 'What causes meltdowns?' },
            { id: 'a3', text: 'Give me a calming technique' },
          ];
        } else if (messageText.includes('sleep')) {
          newSuggestions = [
            { id: 'b1', text: 'Bedtime routine tips' },
            { id: 'b2', text: 'Night waking solutions' },
            { id: 'b3', text: 'Sleep training methods' },
          ];
        } else if (messageText.includes('strategies') || messageText.includes('tips')) {
          newSuggestions = [
            { id: 'c1', text: 'Tell me more about that' },
            { id: 'c2', text: 'How do I start?' },
            { id: 'c3', text: 'Give me an example' },
          ];
        } else {
          newSuggestions = [
            { id: 'd1', text: 'What do experts recommend?' },
            { id: 'd2', text: 'Why does this happen?' },
            { id: 'd3', text: 'How can I be consistent?' },
          ];
        }
        
        setSuggestions(newSuggestions);
      }
    }
  }, [displayMessages.length]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (displayMessages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayMessages.length]);
  
  // Function to handle sending a message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Send message via chat context (which handles OpenAI API call)
    sendMessage(text);
    
    // Clear input
    setInput('');
  };
  
  // Handle suggestion press
  const handleSuggestionPress = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text);
  };
  
  // Render message item
  const renderMessageItem = ({ item }: { item: DisplayMessage }) => (
    <MessageBubble message={item} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Pattern */}
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
        <View style={[
          styles.content,
          { 
            paddingTop: insets.top + 10, 
            paddingBottom: insets.bottom 
          }
        ]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat with Sunny</Text>
          </View>

          <FlatList
            ref={listRef}
            data={displayMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.common.teal} />
              <Text style={styles.loadingText}>Sunny is thinking...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion) => (
              <SuggestionButton
                key={suggestion.id}
                suggestion={suggestion}
                onPress={() => handleSuggestionPress(suggestion)}
              />
            ))}
          </View>

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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.common.teal,
    fontSize: 14,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 200, 200, 0.8)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Warm white background like in Image 3
  },
  content: {
    flex: 1,
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
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
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
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
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
});
