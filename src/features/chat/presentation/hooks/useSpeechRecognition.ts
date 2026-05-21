import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isRecording: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTranscript: () => void;
  recordingDuration: number;
}

/**
 * Hook para reconocimiento de voz usando Web Speech API
 * Compatible con Expo Go (sin módulos nativos)
 * 
 * En Web: Usa Web Speech API (SpeechRecognition)
 * En Mobile: Requiere Development Build con expo-speech-recognition
 */
export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const interimTranscriptRef = useRef<string>('');

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setRecordingDuration(0);
      interimTranscriptRef.current = '';

      // En web, usar Web Speech API
      if (Platform.OS === 'web') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
          return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsRecording(true);
          let duration = 0;
          durationIntervalRef.current = setInterval(() => {
            duration += 0.1;
            setRecordingDuration(Math.floor(duration * 10) / 10);
          }, 100);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          interimTranscriptRef.current = interimTranscript;
          setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError(`Error: ${event.error}`);
          setIsRecording(false);
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
          }
        };

        recognition.onend = () => {
          if (isRecording) {
            // Si sigue grabando, reiniciar
            try {
              recognition.start();
            } catch (e) {
              setIsRecording(false);
              if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
              }
            }
          }
        };

        recognition.start();
      } else {
        // En mobile, mostrar mensaje de requerimiento de Development Build
        setError('Reconocimiento de voz requiere Development Build con expo-speech-recognition');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al iniciar reconocimiento de voz';
      setError(errorMessage);
      setIsRecording(false);
      console.error('Speech recognition error:', err);
    }
  }, [isRecording]);

  const stopRecording = useCallback(async () => {
    try {
      // Limpiar intervalo
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (Platform.OS === 'web' && recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      setIsRecording(false);
    } catch (err: any) {
      console.error('Error stopping speech recognition:', err);
      setIsRecording(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setRecordingDuration(0);
    interimTranscriptRef.current = '';
  }, []);

  return {
    transcript,
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
    recordingDuration,
  };
};
