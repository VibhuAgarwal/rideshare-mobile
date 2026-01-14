import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {api} from '../api/client';
import {styles} from '../styles/styles';

export function YourBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchBookings();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancel = async bookingId => {
    Alert.alert('Cancel Booking', 'Are you sure?', [
      {text: 'No'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/bookings/${bookingId}`);
            fetchBookings();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel booking');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.screenTitle}>Your Bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings yet</Text>
      ) : (
        bookings.map(booking => (
          <View key={booking._id} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideRoute}>
                {booking.ride.from} → {booking.ride.to}
              </Text>
              <Text style={styles.statusBadge}>{booking.status}</Text>
            </View>
            <Text style={styles.rideDate}>
              {new Date(booking.ride.date).toLocaleString()}
            </Text>
            <Text style={styles.rideDriver}>
              Driver: {booking.ride.driver.name}
            </Text>
            <Text style={styles.rideDetails}>
              {booking.seatsBooked} seats • Total: ₹{booking.totalPrice}
            </Text>
            {booking.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(booking._id)}>
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
