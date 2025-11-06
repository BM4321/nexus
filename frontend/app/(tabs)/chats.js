import { View, Text } from 'react-native';

export default function ChatsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>💬 Messages</Text>
      <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
        Real-time chat coming soon
      </Text>
    </View>
  );
}
