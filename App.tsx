import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatScreen } from './src/features/chat/presentation/screens/ChatScreen';

/**
 * App Component - Root entry point
 * 
 * Responsibility: Mount global context providers and render the main screen
 * This follows Clean Architecture by separating concerns:
 * - Framework/UI setup happens here
 * - All feature screens are composed at this level
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ChatScreen />
    </SafeAreaProvider>
  );
}
