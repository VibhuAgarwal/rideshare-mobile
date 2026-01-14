import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {api} from '../api/client';
import {styles} from '../styles/styles';

export function ProfileScreen({currentUser, onLogout}) {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsRefreshing, setCarsRefreshing] = useState(false);

  const [addCarOpen, setAddCarOpen] = useState(false);
  const [savingCar, setSavingCar] = useState(false);
  const [carForm, setCarForm] = useState({
    company: '',
    model: '',
    carNumber: '',
    seatsAvailable: '4',
    color: '',
  });

  const fetchCars = async () => {
    setCarsLoading(true);
    try {
      const res = await api.get('/cars');
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCars([]);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmLogout = () => {
    Alert.alert('Logout', 'Do you want to logout?', [
      {text: 'Cancel'},
      {text: 'Logout', style: 'destructive', onPress: onLogout},
    ]);
  };

  const confirmDeleteCar = car => {
    Alert.alert('Delete Car', 'Are you sure you want to delete this car?', [
      {text: 'Cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/cars/${car._id}`);
            await fetchCars();
          } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete car');
          }
        },
      },
    ]);
  };

  const submitCar = async () => {
    if (!carForm.company || !carForm.model || !carForm.carNumber || !carForm.color) {
      Alert.alert('Error', 'Please fill all car fields');
      return;
    }

    const seats = parseInt(carForm.seatsAvailable, 10);
    if (!Number.isFinite(seats) || seats <= 0) {
      Alert.alert('Error', 'Enter valid seats available');
      return;
    }

    setSavingCar(true);
    try {
      await api.post('/cars', {
        company: carForm.company,
        model: carForm.model,
        carNumber: carForm.carNumber,
        seatsAvailable: seats,
        color: carForm.color,
      });

      setAddCarOpen(false);
      setCarForm({company: '', model: '', carNumber: '', seatsAvailable: '4', color: ''});
      await fetchCars();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add car');
    } finally {
      setSavingCar(false);
    }
  };

  const onRefreshCars = async () => {
    if (carsLoading) return;
    setCarsRefreshing(true);
    try {
      await fetchCars();
    } finally {
      setCarsRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={carsRefreshing} onRefresh={onRefreshCars} />
      }>
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

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Cars</Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => setAddCarOpen(true)}>
            <Text style={styles.smallButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {carsLoading ? (
          <ActivityIndicator color="#2563eb" />
        ) : cars.length === 0 ? (
          <Text style={styles.inlineHint}>
            No cars added yet. Add a car to post rides.
          </Text>
        ) : (
          cars.map(car => (
            <View key={car._id} style={styles.carRow}>
              <View style={styles.carRowTop}>
                <Text style={styles.carTitle} numberOfLines={1}>
                  {car.company} {car.model}
                </Text>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={() => confirmDeleteCar(car)}>
                  <Text style={styles.dangerButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.carMeta}>
                {car.carNumber} • {car.color} • {car.seatsAvailable} seats
              </Text>
            </View>
          ))
        )}

      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={addCarOpen}
        onRequestClose={() => (savingCar ? null : setAddCarOpen(false))}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => (savingCar ? null : setAddCarOpen(false))}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add Car</Text>

            <TextInput
              style={styles.input}
              placeholder="Car Company"
              placeholderTextColor="#666"
              value={carForm.company}
              onChangeText={text => setCarForm(prev => ({...prev, company: text}))}
            />

            <TextInput
              style={styles.input}
              placeholder="Model"
              placeholderTextColor="#666"
              value={carForm.model}
              onChangeText={text => setCarForm(prev => ({...prev, model: text}))}
            />

            <TextInput
              style={styles.input}
              placeholder="Car Number"
              placeholderTextColor="#666"
              value={carForm.carNumber}
              onChangeText={text => setCarForm(prev => ({...prev, carNumber: text}))}
              autoCapitalize="characters"
            />

            <TextInput
              style={styles.input}
              placeholder="Seats Available"
              placeholderTextColor="#666"
              value={carForm.seatsAvailable}
              onChangeText={text => setCarForm(prev => ({...prev, seatsAvailable: text}))}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Car Color"
              placeholderTextColor="#666"
              value={carForm.color}
              onChangeText={text => setCarForm(prev => ({...prev, color: text}))}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setAddCarOpen(false)}
                disabled={savingCar}>
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallButton}
                onPress={submitCar}
                disabled={savingCar}>
                {savingCar ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.smallButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
