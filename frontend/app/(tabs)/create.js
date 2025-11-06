import { View, Text } from 'react-native';

export default function CreateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>➕ Create Listing</Text>
      <Text style={{ fontSize: 14, color: '#8E8E93', textAlign: 'center' }}>
        Create service or opportunity coming soon
      </Text>
    </View>
  );
}
