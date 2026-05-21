# 🎯 Clean Architecture - Chat Application
## Resumen Visual del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 APP STRUCTURE                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   App.tsx        │ ◄─── ROOT ENTRY POINT
│ (Root Component) │      • Monta SafeAreaProvider
└────────┬─────────┘      • Renderiza ChatScreen
         │
         ▼
┌──────────────────┐
│  app/index.tsx   │ ◄─── EXPO ROUTER ENTRY POINT
│  (Router entry)  │      • Punto de entrada oficial
└────────┬─────────┘
         │
         ▼
      ┌──────────────────────────────────────────────┐
      │   🎨 PRESENTATION LAYER                      │
      │   (src/features/chat/presentation/)          │
      ├──────────────────────────────────────────────┤
      │ • ChatScreen.tsx ─── Main UI                │
      │ • MessageBubble.tsx ─ Component              │
      │ • useChat.ts ─────── State Hook             │
      └─────────────┬────────────────────────────────┘
                    │ uses
                    ▼
      ┌──────────────────────────────────────────────┐
      │   💼 DOMAIN LAYER (Pure Business Logic)     │
      │   (src/features/chat/domain/)               │
      ├──────────────────────────────────────────────┤
      │ • Message.ts ──────── Entity                │
      │ • ChatRepository.ts ─ Interface (Contract)  │
      │ • SendMessageUseCase ─ Business Logic       │
      └─────────────┬────────────────────────────────┘
                    │ implements
                    ▼
      ┌──────────────────────────────────────────────┐
      │   💾 DATA LAYER (Implementations)           │
      │   (src/features/chat/data/)                 │
      ├──────────────────────────────────────────────┤
      │ • ChatRepositoryImpl ── Repository Impl      │
      │ • GeminiDataSource ─── API Integration      │
      └─────────────┬────────────────────────────────┘
                    │ calls
                    ▼
      ┌──────────────────────────────────────────────┐
      │   🌐 EXTERNAL API                           │
      │   Google Gemini AI                          │
      └──────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│   🔧 DEPENDENCY INJECTION LAYER                      │
│   (src/di/container.ts)                             │
├──────────────────────────────────────────────────────┤
│ • Singleton pattern                                 │
│ • Manages all dependencies                          │
│ • Enables easy testing & mocking                    │
└──────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

FLUJO DE DATOS (Data Flow)

┌─────────┐
│  User   │  "Hola IA!"
└────┬────┘
     │
     ▼
┌──────────────────┐
│ ChatScreen.tsx   │ ◄─── Captura input del usuario
└────┬─────────────┘
     │ calls
     ▼
┌──────────────────┐
│ useChat Hook     │ ◄─── Maneja estado
└────┬─────────────┘
     │ calls
     ▼
┌──────────────────────────────────┐
│ SendMessageUseCase.execute()     │ ◄─── Lógica de negocio
└────┬─────────────────────────────┘
     │ uses (interface)
     ▼
┌──────────────────────────────────┐
│ ChatRepository (interface)       │ ◄─── Contrato
└────┬─────────────────────────────┘
     │ implements
     ▼
┌──────────────────────────────────┐
│ ChatRepositoryImpl                │ ◄─── Implementación
└────┬─────────────────────────────┘
     │ calls
     ▼
┌──────────────────────────────────┐
│ GeminiDataSource                 │ ◄─── Integración API
└────┬─────────────────────────────┘
     │ HTTP Request
     ▼
┌──────────────────────────────────┐
│ Google Gemini API                │ ◄─── Servicio externo
└────┬─────────────────────────────┘
     │ Response
     ▼
┌──────────────────────────────────┐
│ Message Entity (wrapped)         │ ◄─── Modelo de dominio
└────┬─────────────────────────────┘
     │ update state
     ▼
┌──────────────────┐
│ useChat Hook     │ ◄─── Estado actualizado
└────┬─────────────┘
     │ trigger re-render
     ▼
┌──────────────────┐
│ ChatScreen.tsx   │ ◄─── UI actualizada
└──────────────────┘

═══════════════════════════════════════════════════════════════

📋 ARCHIVOS CREADOS/CONFIGURADOS

✅ App.tsx
   └─ Root component con SafeAreaProvider
   
✅ app/index.tsx
   └─ Expo Router entry point
   
✅ src/di/container.ts
   └─ Dependency Injection container
   
✅ src/ARCHITECTURE.md
   └─ Documentación detallada de la arquitectura
   
✅ src/config.ts
   └─ Configuración y checklist
   
✅ SETUP.md
   └─ Guía de instalación y ejecución
   
✅ .env (ya existente)
   └─ EXPO_PUBLIC_GEMINI_API_KEY configurada

═══════════════════════════════════════════════════════════════

🎯 PRINCIPIOS DE CLEAN ARCHITECTURE APLICADOS

✅ Separation of Concerns
   └─ Cada capa tiene una responsabilidad única

✅ Dependency Inversion
   └─ Los módulos dependen de abstracciones, no de implementaciones

✅ Interface Segregation
   └─ Interfaces específicas para cada comportamiento

✅ Framework Independence
   └─ La capa de dominio no depende de React

✅ Testability
   └─ Fácil de mockear y testear por inyección de dependencias

✅ Scalability
   └─ Agregar nuevas features sigue el mismo patrón

═══════════════════════════════════════════════════════════════

🚀 PRÓXIMOS PASOS

1. npm install    ─── Instalar dependencias
2. npm start      ─── Iniciar el desarrollo
3. Seleccionar plataforma (iOS/Android/Web)
4. ¡Disfrutar! 🎉

═══════════════════════════════════════════════════════════════
