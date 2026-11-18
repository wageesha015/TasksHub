import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';

export default function ProfileScreen() {
  const [studentName, setStudentName] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');
      if (storedProfile) {
        const parsedData = JSON.parse(storedProfile);
        setStudentName(parsedData.name || '');
        setStudentId(parsedData.id || '');
        setProfileImage(parsedData.imageUri || null);
      }
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', "You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      Alert.alert('Error', 'Please enter both Name and Student ID.');
      return;
    }

    try {
      const profileData = {
        name: studentName,
        id: studentId,
        imageUri: profileImage,
      };
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile details saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setStudentName('');
      setStudentId('');
      setProfileImage(null);
      Alert.alert('Success', 'All local data has been wiped.');
    } catch (error) {
      console.error('Failed to clear storage', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />
        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>✎</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>Student Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={studentName}
        onChangeText={setStudentName}
        placeholder="John Doe"
      />

      <Text style={styles.label}>Student ID</Text>
      <TextInput
        style={styles.input}
        value={studentId}
        onChangeText={setStudentId}
        placeholder="CS/2020/001"
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
        <Text style={styles.buttonText}>Save Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Tasks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  imageContainer: { marginBottom: 20, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadgeText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { alignSelf: 'flex-start', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButton: {
    width: '100%',
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});