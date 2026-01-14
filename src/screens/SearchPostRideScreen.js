import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {api} from '../api/client';
import {styles} from '../styles/styles';

const isValidDate = dateStr => {
  if (!dateStr) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

const formatYMD = dateObj => {
  const yyyy = String(dateObj.getFullYear());
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatHM = dateObj => {
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const parseYMD = ymd => {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split('-').map(n => parseInt(n, 10));
  const dateObj = new Date(y, m - 1, d);
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
};

const formatRideTime = dateValue => {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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

  const [rideDateTime, setRideDateTime] = useState(null);
  const [tempDateTime, setTempDateTime] = useState(new Date());
  const [iosDateTimeOpen, setIosDateTimeOpen] = useState(false);
  const [androidPickerMode, setAndroidPickerMode] = useState(null);

  const [recentPostedRides, setRecentPostedRides] = useState([]);
  const [recentPostedLoading, setRecentPostedLoading] = useState(false);

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carPickerOpen, setCarPickerOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const parsedSeats = useMemo(() => {
    const n = parseInt(formData.seats, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [formData.seats]);

  const dateTimeDisplayValue = useMemo(() => {
    if (rideDateTime) return `${formatYMD(rideDateTime)} ${formatHM(rideDateTime)}`;
    return formData.date;
  }, [formData.date, rideDateTime]);

  const openDateTimePicker = () => {
    const base = rideDateTime || parseYMD(formData.date) || new Date();
    setTempDateTime(base);

    if (Platform.OS === 'ios') {
      setIosDateTimeOpen(true);
      return;
    }

    setAndroidPickerMode('date');
  };

  const clearDateTime = () => {
    setRideDateTime(null);
    setFormData(prev => ({...prev, date: ''}));
  };

  const commitDateTime = dateObj => {
    setRideDateTime(dateObj);
    setFormData(prev => ({...prev, date: formatYMD(dateObj)}));
  };

  const handleAndroidChange = (event, selectedDate) => {
    if (event?.type === 'dismissed') {
      setAndroidPickerMode(null);
      return;
    }

    if (!selectedDate) return;

    if (androidPickerMode === 'date') {
      const next = new Date(tempDateTime);
      next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setTempDateTime(next);
      setAndroidPickerMode('time');
      return;
    }

    if (androidPickerMode === 'time') {
      const next = new Date(tempDateTime);
      next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      commitDateTime(next);
      setAndroidPickerMode(null);
    }
  };

  const fetchRecentPostedRides = async () => {
    setRecentPostedLoading(true);
    try {
      const response = await api.get('/rides/my-rides');
      const rides = Array.isArray(response.data) ? response.data : [];

      const sorted = rides
        .slice()
        .sort((a, b) => new Date(b?.date).getTime() - new Date(a?.date).getTime());

      setRecentPostedRides(sorted.slice(0, 5));
    } catch {
      setRecentPostedRides([]);
    } finally {
      setRecentPostedLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPostedRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCars = async () => {
    setCarsLoading(true);
    try {
      const res = await api.get('/cars');
      const list = Array.isArray(res.data) ? res.data : [];
      setCars(list);

      // Keep selection valid
      if (selectedCarId && !list.some(c => c?._id === selectedCarId)) {
        setSelectedCarId(null);
      }
    } catch {
      setCars([]);
      setSelectedCarId(null);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (rideType === 'post') {
      fetchCars();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideType]);

  const selectedCar = useMemo(() => {
    if (!selectedCarId) return null;
    return cars.find(c => c?._id === selectedCarId) || null;
  }, [cars, selectedCarId]);

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
    } catch {
      Alert.alert('Error', 'Failed to search rides');
    } finally {
      setLoading(false);
    }
  };

  const handlePostRide = async () => {
    if (!formData.from || !formData.to || !formData.price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (carsLoading) {
      Alert.alert('Please wait', 'Loading your cars...');
      return;
    }

    if (!cars || cars.length === 0) {
      Alert.alert('Add a car first', 'You must add a car in Profile before posting a ride.');
      return;
    }

    if (!selectedCarId) {
      Alert.alert('Select Car', 'Please select a car to post this ride.');
      return;
    }

    if (!rideDateTime) {
      Alert.alert('Error', 'Please select date & time');
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

    if (selectedCar && parsedSeats > (selectedCar?.seatsAvailable || 0)) {
      Alert.alert(
        'Error',
        `Seats cannot exceed car seats (${selectedCar.seatsAvailable}).`,
      );
      return;
    }

    setLoading(true);
    try {
      await api.post('/rides', {
        carId: selectedCarId,
        from: formData.from,
        to: formData.to,
        date: rideDateTime.toISOString(),
        seatsAvailable: parsedSeats,
        pricePerSeat: price,
      });

      Alert.alert('Success', 'Ride posted successfully!');
      setFormData({from: '', to: '', date: '', seats: '1', price: ''});
      setRideDateTime(null);
      setSelectedCarId(null);
      setRideType('search');
      setSearchResults([]);
      await fetchRecentPostedRides();
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

      await fetchRecentPostedRides();
    } finally {
      setRefreshing(false);
    }
  };

const filteredRides = useMemo(() => {
  const now = new Date();

  return recentPostedRides.filter(ride => {
    if (!ride?.date) return false;

    const rideDate = new Date(ride.date);
    if (Number.isNaN(rideDate.getTime())) return false;

    // Exclude cancelled rides
    if (ride.status === 'cancelled') return false;

    // Only future rides
    return rideDate > now;
  });
}, [recentPostedRides]);

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
          placeholderTextColor="#666"
          value={formData.from}
          onChangeText={text => setFormData({...formData, from: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="To"
          placeholderTextColor="#666"
          value={formData.to}
          onChangeText={text => setFormData({...formData, to: text})}
        />

        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateInputButton}
            onPress={openDateTimePicker}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.dateInputText,
                !dateTimeDisplayValue && styles.dateInputPlaceholder,
              ]}>
              {dateTimeDisplayValue || 'Select Date & Time'}
            </Text>
          </TouchableOpacity>

          {!!dateTimeDisplayValue && (
            <TouchableOpacity
              style={styles.clearDateButton}
              onPress={clearDateTime}
              activeOpacity={0.8}>
              <Text style={styles.clearDateText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {Platform.OS === 'android' && androidPickerMode && (
  <View style={styles.androidPickerWrapper}>
    <DateTimePicker
      value={tempDateTime}
      mode={androidPickerMode}
      display="default"
      onChange={handleAndroidChange}
    />
  </View>
)}


        {Platform.OS === 'ios' && (
          <Modal
            transparent
            animationType="fade"
            visible={iosDateTimeOpen}
            onRequestClose={() => setIosDateTimeOpen(false)}>
            <Pressable
              style={styles.dateTimeModalBackdrop}
              onPress={() => setIosDateTimeOpen(false)}>
              <Pressable style={styles.dateTimeModalCard} onPress={() => {}}>
                <Text style={styles.dateTimeModalTitle}>Select Date & Time</Text>

                <View style={styles.dateTimePickerBlock}>
                  <DateTimePicker
                    value={tempDateTime}
                    mode="date"
                    display="inline"
                    onChange={(e, d) => {
                      if (e?.type === 'dismissed' || !d) return;
                      const next = new Date(tempDateTime);
                      next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
                      setTempDateTime(next);
                    }}
                  />
                </View>

                <View style={styles.dateTimePickerBlock}>
                  <DateTimePicker
                    value={tempDateTime}
                    mode="time"
                    display="spinner"
                    onChange={(e, d) => {
                      if (e?.type === 'dismissed' || !d) return;
                      const next = new Date(tempDateTime);
                      next.setHours(d.getHours(), d.getMinutes(), 0, 0);
                      setTempDateTime(next);
                    }}
                  />
                </View>

                <View style={styles.dateTimeModalActions}>
                  <TouchableOpacity
                    style={[styles.dateTimeActionButton, styles.dateTimeActionSecondary]}
                    onPress={() => setIosDateTimeOpen(false)}>
                    <Text style={styles.dateTimeActionSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dateTimeActionButton, styles.dateTimeActionPrimary]}
                    onPress={() => {
                      commitDateTime(tempDateTime);
                      setIosDateTimeOpen(false);
                    }}>
                    <Text style={styles.dateTimeActionPrimaryText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        )}

        {rideType === 'post' && (
          <>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setCarPickerOpen(true)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.pickerButtonText,
                  !selectedCar && styles.pickerButtonPlaceholder,
                ]}>
                {carsLoading
                  ? 'Loading cars...'
                  : selectedCar
                    ? `${selectedCar.company} ${selectedCar.model} • ${selectedCar.carNumber}`
                    : 'Select Car'}
              </Text>
            </TouchableOpacity>

            <Modal
              transparent
              animationType="fade"
              visible={carPickerOpen}
              onRequestClose={() => setCarPickerOpen(false)}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setCarPickerOpen(false)}>
                <Pressable style={styles.modalCard} onPress={() => {}}>
                  <Text style={styles.modalTitle}>Select a car</Text>

                  <ScrollView>
                    {cars.length === 0 ? (
                      <Text style={styles.inlineHint}>
                        No cars found. Add one in Profile.
                      </Text>
                    ) : (
                      cars.map(car => {
                        const isSelected = car?._id === selectedCarId;
                        return (
                          <TouchableOpacity
                            key={car._id}
                            style={[
                              styles.modalItem,
                              isSelected && styles.modalItemSelected,
                            ]}
                            onPress={() => {
                              setSelectedCarId(car._id);
                              // Clamp seats to car capacity
                              const cap = car?.seatsAvailable || 1;
                              const nextSeats = Math.min(parsedSeats, cap);
                              setFormData(prev => ({...prev, seats: String(nextSeats)}));
                              setCarPickerOpen(false);
                            }}>
                            <Text style={styles.modalItemTitle}>
                              {car.company} {car.model}
                            </Text>
                            <Text style={styles.modalItemSubtitle}>
                              {car.carNumber} • {car.color} • {car.seatsAvailable} seats
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </ScrollView>

                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      style={styles.modalSecondaryButton}
                      onPress={() => setCarPickerOpen(false)}>
                      <Text style={styles.modalSecondaryButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Seats"
          placeholderTextColor="#666"
          value={formData.seats}
          onChangeText={text => setFormData({...formData, seats: text})}
          keyboardType="numeric"
        />

        {rideType === 'post' && (
          <TextInput
            style={styles.input}
            placeholder="Price per Seat (₹)"
            placeholderTextColor="#666"
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

      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>Recent Posted Rides</Text>

        {recentPostedLoading ? (
          <View style={styles.recentLoadingRow}>
            <ActivityIndicator color="#2563eb" />
          </View>
        ) : filteredRides.length === 0 ? (
          <Text style={styles.recentEmptyText}>No rides posted yet.</Text>
        ) : (
          filteredRides.map(ride => (
            <View key={ride._id} style={styles.recentRideRow}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => {
                  // Quick-fill search inputs from a posted ride
                  setFormData(prev => ({
                    ...prev,
                    from: ride?.from || prev.from,
                    to: ride?.to || prev.to,
                  }));
                  setRideType('search');
                }}>
                <Text style={styles.timeButtonText}>
                  {formatRideTime(ride?.date)}
                </Text>
              </TouchableOpacity>

              <Text style={styles.recentRideRoute} numberOfLines={1}>
                {(ride?.to || '') + ' → ' + (ride?.from || '')}
              </Text>
            </View>
          ))
        )}
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
              {!!ride?.car && (
                <Text style={styles.rideDetails}>
                  Car: {ride.car.company} {ride.car.model} • {ride.car.color} • {ride.car.carNumber}
                </Text>
              )}
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
