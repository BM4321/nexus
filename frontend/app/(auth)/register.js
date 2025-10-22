import { Text, View, Button } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-4">Register for Nexus</Text>
      <Text className="text-gray-600 mb-6">TODO: Registration Form Goes Here</Text>
      
      {/* Link back to login */}
      <Link href="/login" replace asChild>
        <Button title="Go to Login" color="#2563eb" />
      </Link>
    </View>
  );
}