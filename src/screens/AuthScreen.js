import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {api} from '../api/client';
import {styles} from '../styles/styles';

export function AuthScreen({onAuthSuccess}) {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    if (mode === 'register' && (!formData.name || !formData.phone)) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, formData);
      onAuthSuccess(response.data.user, response.data.token);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Authentication failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll}>
        <View style={styles.authBox}>
          <Text style={styles.authTitle}>RideShare</Text>
          <Text style={styles.authSubtitle}>
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </Text>

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={text => setFormData({...formData, password: text})}
            secureTextEntry
          />

          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={text => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
            />
          )}

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authButtonText}>
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
            <Text style={styles.switchText}>
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
