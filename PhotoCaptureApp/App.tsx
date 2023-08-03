import React, { useState, useEffect } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';

const App = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera access to capture photos.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const photo = await ImagePicker.launchCameraAsync();
      if (!photo.canceled) {
        // setPhotoUri(photo.uri);
        getLocation();
      }
    } else {
      Alert.alert('Permission needed', 'Please grant camera access to capture photos.');
    }
  };
  
  
  

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } else {
      Alert.alert('Permission needed', 'Please grant location access to retrieve device location.');
    }
  };

  const sendDataToServer = async (photoUri: string | null, location: Location.LocationObject | null) => {
    try {
      const response = await axios.post('https://your-server-endpoint.com/api/photos', {
        photo: photoUri,
        location: location,
      });
      console.log('Data sent successfully!');
    } catch (error) {
      console.error('Error while sending data:', error);
    }
  };

  useEffect(() => {
    if (photoUri && location) {
      sendDataToServer(photoUri, location);
    }
  }, [photoUri, location]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
      <Button title="Capture Photo" onPress={takePhoto} />
    </View>
  );
};

export default App;
