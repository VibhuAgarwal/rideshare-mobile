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

export function YourRidesScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await api.get('/rides/my-rides');
      setRides(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRides();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancel = async rideId => {
    Alert.alert('Cancel Ride', 'Are you sure?', [
      {text: 'No'},
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/rides/${rideId}`);
            fetchRides();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel ride');
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
      <Text style={styles.screenTitle}>Your Posted Rides</Text>
      {rides.length === 0 ? (
        <Text style={styles.emptyText}>No rides posted yet</Text>
      ) : (
        rides.map(ride => (
          <View key={ride._id} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideRoute}>
                {ride.from} → {ride.to}
              </Text>
              <Text style={styles.statusBadge}>{ride.status}</Text>
            </View>
            <Text style={styles.rideDate}>
              {new Date(ride.date).toLocaleString()}
            </Text>
            <Text style={styles.rideDetails}>
              {ride.seatsAvailable}/{ride.totalSeats} seats • ₹
              {ride.pricePerSeat}/seat
            </Text>
            {ride.status === 'upcoming' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancel(ride._id)}>
                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
