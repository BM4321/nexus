import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Slot />
      </ChatProvider>
    </AuthProvider>
  );
}
