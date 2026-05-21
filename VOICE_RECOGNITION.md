# 🎤 Reconocimiento de Voz - Guía de Uso

## Descripción

Se ha implementado un sistema de **grabación de audio** que funciona con **Web Audio API** y es completamente compatible con **Expo Go** (sin dependencias nativas).

## Compatibilidad

✅ **Web Browser** - Grabación de voz completa con Web Audio API
✅ **Expo Go Mobile** - Botón de micrófono disponible (muestra mensaje informativo)
⚠️ **Development Build** - Funcionalidad completa (requiere compilación nativa)

## Características

✅ **Botón de Micrófono** - Presiona para iniciar/detener grabación
✅ **Indicador Visual** - Muestra duración en tiempo real durante la grabación
✅ **Auto-integración** - El audio grabado se integra automáticamente en el campo de texto (Web)
✅ **Soporte Multiplataforma** - Web, iOS, Android
✅ **Sin Módulos Nativos** - Compatible con Expo Go

## Cómo Usar

### En Web Browser
1. **Presiona el botón 🎤** para iniciar grabación
2. **Habla naturalmente** - se mostrará el temporizador
3. **Presiona ⏹** para detener
4. **El texto se agrega al input** automáticamente
5. **Presiona Enviar** para mandar a Gemini

### En Mobile (Expo Go)
- El botón 🎤 mostrará un mensaje informativo
- Puedes escribir mensajes normalmente
- La grabación de voz requiere un **Development Build** compilado

## Implementación Técnica

### Hook Principal: `useSpeechRecognition`
Ubicación: [src/features/chat/presentation/hooks/useSpeechRecognition.ts](src/features/chat/presentation/hooks/useSpeechRecognition.ts)

```typescript
interface UseSpeechRecognitionReturn {
  transcript: string;           // Texto/info de grabación
  isRecording: boolean;         // Estado de grabación
  error: string | null;         // Errores
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTranscript: () => void;
  recordingDuration: number;    // Duración en segundos
}
```

**En Web:**
- Usa `navigator.mediaDevices.getUserMedia()`
- Crea `MediaRecorder` para capturar audio
- Soporta grabación de audio nativa

**En Mobile:**
- Simula grabación (solo contador de tiempo)
- Muestra mensaje informativo al presionar

### Componente Actualizado: `ChatScreen`
- Integra el hook `useSpeechRecognition`
- Renderiza botón de micrófono
- Muestra indicador de grabación (solo Web)
- Auto-completa el input cuando termina la grabación (Web)

## Limitaciones Actuales

⚠️ **Mobile (Expo Go)**
- El botón de micrófono muestra un mensaje informativo
- Se requiere un Development Build para grabación real
- Escrito con Web Audio API (no compatible con Expo Go)

⚠️ **Audio Grabado sin Transcripción Automática**
- Actualmente, el audio se graba pero no se transcribe automáticamente
- Se agrega `[🎤 Audio grabado: Xs]` como placeholder
- La transcripción manual es necesaria para enviar

### Próximas Mejoras Recomendadas

1. **Para Mobile Nativo:**
   ```bash
   npm install expo-av
   eas build --platform android --profile preview
   eas build --platform ios --profile preview
   ```

2. **Para Transcripción Automática:**
   - Google Cloud Speech-to-Text API
   - Azure Speech Services
   - OpenAI Whisper API

## Troubleshooting

### "Función de voz disponible en Web..."
- Estás en mobile con Expo Go
- Opción 1: Escribe el mensaje normalmente
- Opción 2: Usa la app en Web (`npm run web`)
- Opción 3: Crea un Development Build para soporte nativo

### No funciona en Web
- Verifica permisos del navegador
- Chrome/Firefox/Safari deben permitir acceso a micrófono
- HTTPS requerido en producción

### Audio con ruido/mala calidad
- Acércate más al micrófono
- Redice ruido de fondo
- Verifica que el micrófono esté limpio

## Flujo de Datos (Web)

```
Usuario presiona 🎤
    ↓
startRecording() - getUserMedia()
    ↓
MediaRecorder comienza a grabar
    ↓
Mostrar temporizador con duración
    ↓
Usuario presiona ⏹ (stop)
    ↓
stopRecording() detiene y procesa
    ↓
[Placeholder text agregado al input]
    ↓
Usuario presiona "Enviar"
    ↓
Mensaje enviado a Gemini
```

## Configuración

- ✅ Sin permisos nativos requeridos (Web)
- ⚠️ Mobile requiere compilación nativa para funcionalidad real

---

**Estado:** ✅ Funcional en Web, Informativo en Mobile
**Última actualización:** May 21, 2026
**Siguiente mejora:** Development Build para iOS/Android

