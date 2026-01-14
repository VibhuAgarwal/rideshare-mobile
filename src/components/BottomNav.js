import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {styles} from '../styles/styles';

export function BottomNav({activeTab, onTabChange}) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('search')}>
        <Text
          style={[
            styles.navText,
            activeTab === 'search' && styles.navTextActive,
          ]}>
          🔍 Find Ride
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('rides')}>
        <Text
          style={[
            styles.navText,
            activeTab === 'rides' && styles.navTextActive,
          ]}>
          🚗 Your Rides
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('bookings')}>
        <Text
          style={[
            styles.navText,
            activeTab === 'bookings' && styles.navTextActive,
          ]}>
          📅 Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabChange('profile')}>
        <Text
          style={[
            styles.navText,
            activeTab === 'profile' && styles.navTextActive,
          ]}>
          👤 Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
