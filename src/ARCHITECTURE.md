# Clean Architecture - Chat Application

## Structure Overview

```
src/
├── di/                          # Dependency Injection
│   └── container.ts            # DI Container - Manages all dependencies
│
├── features/                    # Feature modules
│   └── chat/
│       ├── data/               # Data Layer
│       │   ├── datasources/    # External APIs integration
│       │   │   └── GeminiDataSource.ts
│       │   └── repositories/   # Repository implementations
│       │       └── ChatRepositoryImpl.ts
│       │
│       ├── domain/             # Business Logic Layer (Framework-independent)
│       │   ├── entities/       # Business models
│       │   │   └── Message.ts
│       │   ├── repositories/   # Repository interfaces
│       │   │   └── ChatRepository.ts
│       │   └── usecases/       # Business use cases
│       │       └── SendMessageUseCase.ts
│       │
│       └── presentation/       # UI Layer (React Native)
│           ├── screens/        # Screen components
│           │   └── ChatScreen.tsx
│           ├── components/     # Reusable UI components
│           │   └── MessageBubble.tsx
│           └── hooks/          # Custom React hooks
│               └── useChat.ts
```

## Architecture Layers

### 1. **Presentation Layer** (UI/React Native)
- **Location:** `features/chat/presentation/`
- **Responsibility:** Render UI and handle user interactions
- **Dependencies:** Domain layer (use cases, entities)
- **Files:**
  - `ChatScreen.tsx` - Main screen
  - `MessageBubble.tsx` - Reusable message component
  - `useChat.ts` - Custom hook that orchestrates use cases

### 2. **Domain Layer** (Business Logic)
- **Location:** `features/chat/domain/`
- **Responsibility:** Contains pure business logic (framework-independent)
- **No external dependencies** - Only depends on interfaces/contracts
- **Components:**
  - **Entities:** `Message` - Business models
  - **Repositories:** `ChatRepository` - Interface defining contracts
  - **Use Cases:** `SendMessageUseCase` - Business workflows

### 3. **Data Layer** (Infrastructure)
- **Location:** `features/chat/data/`
- **Responsibility:** Implement repositories and connect to external services
- **Dependencies:** Domain layer (implements repository interfaces)
- **Components:**
  - **Data Sources:** `GeminiDataSource` - External API integration (Google Gemini)
  - **Repositories:** `ChatRepositoryImpl` - Implements `ChatRepository` interface

### 4. **Dependency Injection**
- **Location:** `src/di/container.ts`
- **Responsibility:** Centralized dependency management
- **Pattern:** Singleton
- **Benefits:**
  - Easy testing (can swap implementations)
  - Scalable (add new dependencies without touching use cases)
  - Follows Inversion of Control (IoC)

## Data Flow

```
User Input (ChatScreen)
    ↓
useChat Hook
    ↓
SendMessageUseCase.execute()
    ↓
ChatRepository.sendMessage() [interface]
    ↓
ChatRepositoryImpl.sendMessage() [implementation]
    ↓
GeminiDataSource.generateResponse()
    ↓
Google Gemini API
    ↓
Message Entity
    ↓
Update React State
    ↓
Re-render ChatScreen
```

## Key Principles Applied

✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Dependency Inversion** - High-level modules don't depend on low-level modules; both depend on abstractions
✅ **Interface Segregation** - `ChatRepository` interface defines only what's needed
✅ **Framework Independence** - Domain layer is pure TypeScript, no React/React Native dependencies
✅ **Testability** - Easy to mock and test because dependencies are injected
✅ **Scalability** - Adding new features follows the same pattern

## How to Add a New Feature

1. **Create domain entities** (`domain/entities/`)
2. **Create repository interfaces** (`domain/repositories/`)
3. **Create use cases** (`domain/usecases/`)
4. **Implement repositories** (`data/repositories/`)
5. **Implement data sources** (`data/datasources/`)
6. **Create presentation components** (`presentation/screens/` & `components/`)
7. **Create custom hooks** (`presentation/hooks/`)
8. **Register in DI Container** (`src/di/container.ts`)

## Root Entry Points

- **`App.tsx`** - Root component that provides SafeAreaProvider context
- **`app/index.tsx`** - Expo Router entry point that loads the App

---

*This structure ensures that your app is maintainable, testable, and scalable as it grows.*
