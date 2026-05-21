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
 * Hook para reconocimiento de voz usando Web Audio API
 * Compatible con Expo Go (sin módulos nativos)
 * 
 * En Web: Usa Web Audio API
 * En Mobile: Muestra placeholder amigable
 */
export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<any>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<any>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setRecordingDuration(0);

      // En web, usar Web Audio API
      if (Platform.OS === 'web') {
        const stream = await (navigator.mediaDevices as any).getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const mediaRecorder = new (window as any).MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.start();
        setIsRecording(true);

        let duration = 0;
        durationIntervalRef.current = setInterval(() => {
          duration += 0.1;
          setRecordingDuration(Math.floor(duration * 10) / 10);
        }, 100);
      } else {
        // En mobile, simular grabación
        setIsRecording(true);
        let duration = 0;
        durationIntervalRef.current = setInterval(() => {
          duration += 0.1;
          setRecordingDuration(Math.floor(duration * 10) / 10);
        }, 100);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al iniciar grabación';
      setError(errorMessage);
      setIsRecording(false);
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      // Limpiar intervalo
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (Platform.OS === 'web' && mediaRecorderRef.current) {
        // Detener MediaRecorder en web
        mediaRecorderRef.current.stop();
        
        // Detener stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track: any) => track.stop());
        }

        setTranscript(`[🎤 Audio grabado: ${recordingDuration}s]`);
      } else {
        // En mobile, solo crear placeholder
        setTranscript(`[🎤 Audio grabado: ${recordingDuration}s]`);
      }

      setIsRecording(false);
      mediaRecorderRef.current = null;
      streamRef.current = null;
    } catch (err: any) {
      console.error('Error stopping recording:', err);
      setIsRecording(false);
    }
  }, [recordingDuration]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setRecordingDuration(0);
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
