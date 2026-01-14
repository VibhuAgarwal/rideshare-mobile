import React from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {styles} from '../styles/styles';

export function ProfileScreen({currentUser, onLogout}) {
  const confirmLogout = () => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel'},
      {text: 'Logout', style: 'destructive', onPress: onLogout},
    ]);
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{currentUser?.name}</Text>
        <Text style={styles.profileEmail}>{currentUser?.email}</Text>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Phone</Text>
          <Text style={styles.profileValue}>{currentUser?.phone}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Member Since</Text>
          <Text style={styles.profileValue}>
            {new Date(currentUser?.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Total Rides</Text>
          <Text style={styles.profileValue}>{currentUser?.totalRides}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Rating</Text>
          <Text style={styles.profileValue}>⭐ {currentUser?.rating?.toFixed(1)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
