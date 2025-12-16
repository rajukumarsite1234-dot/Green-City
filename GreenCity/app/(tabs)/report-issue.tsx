import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  ActivityIndicator 
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { issueService } from '../../services/apiService';

import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';

type LocationType = {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp?: number;
};

export default function ReportIssueScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationType['coords'] | null>(null);
  const [address, setAddress] = useState('Getting location...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const cameraRef = useRef<Camera>(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

      // Get current location
      if (locationStatus.status === 'granted') {
        await getCurrentLocation();
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location.coords);
      
      // Get address from coordinates
      const address = await Location.reverseGeocodeAsync(location.coords);
      if (address.length > 0) {
        const { street, city, region, country } = address[0];
        setAddress(`${street || ''} ${city || ''} ${region || ''} ${country || ''}`.trim());
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location. Please enable location services.');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
          exif: false,
        });
        setImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please take or select a photo first');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Could not get your location. Please enable location services.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const issueData = {
        title: 'Environmental Issue',
        description: 'Reported via mobile app',
        category: 'other',
        location: {
          coordinates: [location.longitude, location.latitude],
          address: address,
        },
        images: [{
          uri: image,
          type: 'image/jpeg',
          name: `issue_${Date.now()}.jpg`,
        }]
      };

      // Call the API to report the issue
      const response = await issueService.reportIssue(issueData);
      
      if (response.success) {
        Alert.alert('Success', 'Issue reported successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        throw new Error('Failed to report issue');
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      Alert.alert('Error', 'Failed to report issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }
  
  if (hasCameraPermission === false || hasLocationPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera or location. Please enable in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.back}
            ratio="4:3"
          >
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </Camera>
          
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color="white" />
            <Text style={styles.galleryButtonText}>Choose from gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#4CAF50" />
            <Text style={styles.locationText} numberOfLines={2}>
              {address}
            </Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retakeButton]}
              onPress={() => setImage(null)}
            >
              <Ionicons name="camera-reverse" size={20} color="#333" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cameraButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  galleryButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  galleryButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 10,
    marginTop: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  locationText: {
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  retakeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  retakeButtonText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
});