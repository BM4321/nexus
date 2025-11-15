import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo/Brand */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🚀 Nexus</Text>
        <Text style={styles.tagline}>Connect. Collaborate. Create.</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💼</Text>
          <Text style={styles.featureTitle}>Find Opportunities</Text>
          <Text style={styles.featureText}>
            Discover jobs and projects that match your skills
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🤝</Text>
          <Text style={styles.featureTitle}>Connect with Talent</Text>
          <Text style={styles.featureText}>
            Build your network and collaborate with professionals
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💬</Text>
          <Text style={styles.featureTitle}>Real-time Chat</Text>
          <Text style={styles.featureText}>
            Communicate instantly with potential clients or talent
          </Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Join thousands of professionals already on Nexus
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    marginVertical: 30,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ctaContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
});