import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {api} from '../api/client';
import {styles} from '../styles/styles';

const isValidDate = dateStr => {
  if (!dateStr) return true;
  // Simple YYYY-MM-DD check
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

export function SearchPostRideScreen() {
  const [rideType, setRideType] = useState('search');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    seats: '1',
    price: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRideId, setBookingRideId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const parsedSeats = useMemo(() => {
    const n = parseInt(formData.seats, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [formData.seats]);

  const handleSearch = async () => {
    if (!formData.from || !formData.to) {
      Alert.alert('Error', 'Please enter from and to locations');
      return;
    }

    if (!isValidDate(formData.date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/rides/search', {
        params: {
          from: formData.from,
          to: formData.to,
          ...(formData.date ? {date: formData.date} : {}),
          seats: String(parsedSeats),
        },
      });

      setSearchResults(response.data);
      if (response.data.length === 0) {
        Alert.alert('No Rides', 'No rides found matching your criteria');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search rides');
    } finally {
      setLoading(false);
    }
  };

  const handlePostRide = async () => {
    if (!formData.from || !formData.to || !formData.date || !formData.price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!isValidDate(formData.date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format');
      return;
    }

    const price = parseFloat(formData.price);
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert('Error', 'Enter a valid price');
      return;
    }

    setLoading(true);
    try {
      await api.post('/rides', {
        from: formData.from,
        to: formData.to,
        date: formData.date,
        seatsAvailable: parsedSeats,
        pricePerSeat: price,
      });

      Alert.alert('Success', 'Ride posted successfully!');
      setFormData({from: '', to: '', date: '', seats: '1', price: ''});
      setRideType('search');
      setSearchResults([]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async rideId => {
    if (bookingRideId) return;

    setBookingRideId(rideId);
    try {
      await api.post('/bookings', {rideId, seatsBooked: 1});
      Alert.alert('Success', 'Ride booked successfully!');
      await handleSearch();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to book ride');
    } finally {
      setBookingRideId(null);
    }
  };

  const onRefresh = async () => {
    if (loading) return;
    setRefreshing(true);
    try {
      if (rideType === 'search' && (formData.from || formData.to)) {
        await handleSearch();
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            rideType === 'search' && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setRideType('search');
            setSearchResults([]);
          }}>
          <Text
            style={[
              styles.toggleText,
              rideType === 'search' && styles.toggleTextActive,
            ]}>
            🔍 Search Ride
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            rideType === 'post' && styles.toggleButtonActiveGreen,
          ]}
          onPress={() => {
            setRideType('post');
            setSearchResults([]);
          }}>
          <Text
            style={[
              styles.toggleText,
              rideType === 'post' && styles.toggleTextActive,
            ]}>
            ➕ Post Ride
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={formData.from}
          onChangeText={text => setFormData({...formData, from: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="To"
          value={formData.to}
          onChangeText={text => setFormData({...formData, to: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={formData.date}
          onChangeText={text => setFormData({...formData, date: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Seats"
          value={formData.seats}
          onChangeText={text => setFormData({...formData, seats: text})}
          keyboardType="numeric"
        />

        {rideType === 'post' && (
          <TextInput
            style={styles.input}
            placeholder="Price per Seat (₹)"
            value={formData.price}
            onChangeText={text => setFormData({...formData, price: text})}
            keyboardType="numeric"
          />
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            rideType === 'post' && styles.submitButtonGreen,
          ]}
          onPress={rideType === 'search' ? handleSearch : handlePostRide}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {rideType === 'search' ? 'Search Rides' : 'Post Ride'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Available Rides</Text>
          {searchResults.map(ride => (
            <View key={ride._id} style={styles.rideCard}>
              <Text style={styles.rideRoute}>
                {ride.from} → {ride.to}
              </Text>
              <Text style={styles.rideDate}>
                {new Date(ride.date).toLocaleString()}
              </Text>
              <Text style={styles.rideDriver}>
                Driver: {ride.driver.name} ⭐ {ride.driver.rating.toFixed(1)}
              </Text>
              <Text style={styles.rideDetails}>
                {ride.seatsAvailable} seats • ₹{ride.pricePerSeat}/seat
              </Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookRide(ride._id)}
                disabled={bookingRideId === ride._id}>
                {bookingRideId === ride._id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.bookButtonText}>Book Now</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
