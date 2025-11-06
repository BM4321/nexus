import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <View style={{ backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
          Profile
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            {user?.name || 'User'}
          </Text>
          <Text style={{ fontSize: 14, color: '#8E8E93', marginBottom: 8 }}>
            Email: {user?.email}
          </Text>
          <Text style={{ fontSize: 14, color: '#8E8E93', marginBottom: 20 }}>
            Role: {user?.role || 'N/A'}
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: '#FF3B30',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
