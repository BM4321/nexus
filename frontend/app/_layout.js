import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext'; // <-- NEW IMPORTS

// Custom component to handle the routing based on Auth State
function RootLayoutContent() {
  const { token, isLoading } = useAuth();
  
  // Wait until we check SecureStore for a token
  if (isLoading) {
    // Return a splash screen or loading indicator here
    return null; 
  }
  
  // If user is NOT authenticated, redirect them to the login screen
  if (!token) {
    // Only show the (auth) group if not authenticated
    return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Redirect any attempts to access (app) back to login */}
        <Redirect href="/login" /> 
      </Stack>
    );
  }
  
  // If the user IS authenticated, show the main application layout
  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}


export default function RootLayout() {
  // We need to wrap the whole app in the AuthProvider
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}