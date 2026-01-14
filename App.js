import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BottomNav} from './src/components/BottomNav';
import {Header} from './src/components/Header';
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {AuthScreen} from './src/screens/AuthScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {SearchPostRideScreen} from './src/screens/SearchPostRideScreen';
import {YourBookingsScreen} from './src/screens/YourBookingsScreen';
import {YourRidesScreen} from './src/screens/YourRidesScreen';
import {styles} from './src/styles/styles';

function AppShell() {
  const {loading, isAuthenticated, user, loginWithToken, logout} = useAuth();
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    const loadLastTab = async () => {
      if (!isAuthenticated) return;
      const stored = await AsyncStorage.getItem('activeTab');
      if (stored) setActiveTab(stored);
    };

    loadLastTab();
  }, [isAuthenticated]);

  useEffect(() => {
    const persist = async () => {
      if (!isAuthenticated) return;
      await AsyncStorage.setItem('activeTab', activeTab);
    };
    persist();
  }, [activeTab, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    setActiveTab('search');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={loginWithToken} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      <Header title="RideShare" subtitle={`Welcome, ${user?.name || ''}`} />

      <View style={styles.content}>
        {activeTab === 'search' && <SearchPostRideScreen />}
        {activeTab === 'rides' && <YourRidesScreen />}
        {activeTab === 'bookings' && <YourBookingsScreen />}
        {activeTab === 'profile' && (
          <ProfileScreen currentUser={user} onLogout={handleLogout} />
        )}
      </View>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}