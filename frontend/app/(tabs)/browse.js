import { View, Text } from 'react-native';

export default function BrowseScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>🔍 Browse</Text>
      <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
        Search and filter listings coming soon
      </Text>
    </View>
  );
}
