import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageBubble } from '../components/MessageBubble';
import { useChat } from '../hooks/useChat';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { transcript, isRecording, startRecording, stopRecording, resetTranscript, recordingDuration } = useSpeechRecognition();

  // Cuando se completa la grabación (solo en web), agregar al input
  useEffect(() => {
    if (transcript && !isRecording && Platform.OS === 'web') {
      setInputText(prev => {
        const trimmedTranscript = transcript.trim();
        return prev ? `${prev} ${trimmedTranscript}` : trimmedTranscript;
      });
      resetTranscript();
    }
  }, [transcript, isRecording]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleMicPress = async () => {
    if (Platform.OS !== 'web') {
      setInputText(prev => prev + '[🎤 Reconocimiento de voz disponible solo en Web]');
      return;
    }
    
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat con Gemini</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color='#2563EB' />
            <Text style={styles.loadingText}>Gemini está escribiendo...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {isRecording && (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingPulse} />
            <Text style={styles.recordingText}>Grabando: {recordingDuration.toFixed(1)}s</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleMicPress}
          >
            <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Escribe un mensaje...'
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendIcon}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  clearText: { color: '#EF4444', fontSize: 14 },
  messagesList: { padding: 16, paddingBottom: 8 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: { color: '#6B7280', fontSize: 14 },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: { color: '#DC2626', fontSize: 14 },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
  },
  recordingText: { color: '#991B1B', fontSize: 14, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  micButtonActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  micIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#93C5FD' },
  sendIcon: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
