# 🚀 Chat App with Clean Architecture

Un proyecto de **React Native + Expo** con **Clean Architecture**, integrado con **Google Gemini AI**.

## 📋 Requisitos

- Node.js (v18+)
- npm o yarn
- Expo CLI (instalado globalmente)
- Una API key de Google Gemini (en `.env`)

## 🏗️ Arquitectura

Este proyecto sigue **Clean Architecture** con capas claramente separadas:

```
📱 Presentation (ChatScreen, Components, Hooks)
    ↓
💼 Domain (Entities, Repositories Interfaces, Use Cases)
    ↓
💾 Data (Repository Implementations, Data Sources)
    ↓
🔧 DI Container (Dependency Injection)
```

Consulta [src/ARCHITECTURE.md](src/ARCHITECTURE.md) para más detalles.

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repo-url>
   cd chat-ia-clean
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Verificar `.env`:**
   Asegurate que existe un archivo `.env` en la raíz con:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui
   ```

## ▶️ Ejecución

### Desarrollo
```bash
npm start
```

Luego selecciona tu plataforma:
- **iOS:** Presiona `i`
- **Android:** Presiona `a`
- **Web:** Presiona `w`

### Plataformas específicas
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

## 📁 Estructura de Carpetas

```
chat-ia-clean/
├── App.tsx                          # 🎯 Punto de entrada (Root)
├── app/
│   └── index.tsx                    # Expo Router entry point
├── src/
│   ├── di/
│   │   └── container.ts             # Dependency Injection
│   ├── features/
│   │   └── chat/
│   │       ├── data/                # 💾 Data Layer
│   │       ├── domain/              # 💼 Domain Layer
│   │       └── presentation/        # 📱 Presentation Layer
│   ├── ARCHITECTURE.md              # Documentación detallada
│   └── config.ts                    # Configuración
├── assets/                          # 🖼️ Imágenes y iconos
├── .env                             # Variables de entorno
├── package.json
└── tsconfig.json
```

## 🔌 Endpoints

La app se conecta a:
- **Google Gemini API:** Para generar respuestas de IA

## 🧪 Testing

Para verificar que todo funciona:

```bash
npm run lint
```

## 🎯 Flujo de Datos

1. Usuario escribe un mensaje en `ChatScreen`
2. Presiona enviar
3. Hook `useChat` intercepta
4. Llama a `SendMessageUseCase`
5. Use case usa `ChatRepository` (interfaz)
6. `ChatRepositoryImpl` ejecuta la lógica
7. `GeminiDataSource` llama a Google Gemini
8. Respuesta se envuelve en entidad `Message`
9. Estado se actualiza
10. `ChatScreen` re-renderiza con nuevo mensaje

## 📚 Documentación Adicional

- [src/ARCHITECTURE.md](src/ARCHITECTURE.md) - Guía detallada de arquitectura
- [src/config.ts](src/config.ts) - Configuración y checklist

## 🤝 Agregar Nuevas Features

Simplemente sigue el patrón de carpetas:

```
src/features/nueva-feature/
├── data/
│   ├── datasources/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── screens/
    ├── components/
    └── hooks/
```

1. Define la entidad en `domain/entities/`
2. Crea la interfaz del repo en `domain/repositories/`
3. Implementa el use case en `domain/usecases/`
4. Implementa el repo en `data/repositories/`
5. Crea el data source en `data/datasources/` si necesitas API
6. Crea los componentes en `presentation/`
7. Registra en `src/di/container.ts`

## ⚙️ Tecnologías

- **Expo 56+** - Framework para React Native
- **React Native 0.85+** - Framework UI
- **React 19+** - Librería de componentes
- **TypeScript** - Type safety
- **Google Gemini API** - AI
- **Expo Router** - Routing nativo

## 📝 Notas Importantes

⚠️ **API Key:** No compartas tu `EXPO_PUBLIC_GEMINI_API_KEY` en repositorios públicos.

✅ **Clean Architecture:** Mantén la separación de capas clara y no importes módulos de capas superiores en capas inferiores.

## 🐛 Troubleshooting

Si tienes problemas:

1. **Limpia la cache:**
   ```bash
   npm run reset-project
   ```

2. **Reinstala dependencias:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verifica que el `.env` existe** con la API key correcta

4. **Revisa los logs:** `npm start` mostrará errores

## 📞 Soporte

Revisa la documentación en `src/ARCHITECTURE.md` para entender mejor cómo funciona el proyecto.

---

**Happy coding! 🚀**
