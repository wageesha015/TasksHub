import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {ImageBackground,ScrollView, StyleSheet,Text,TouchableOpacity,View,} from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/image.png')}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Your Tasks</Text>

        <ScrollView style={styles.list}>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.moduleText}>{task.taskName}</Text>
                <Text style={styles.descText}>{task.taskDescription}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-task')}
        >
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    opacity: 0.35,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  list: {
    flex: 1,
  },
  empty: {
    textAlign: 'left',
    marginTop: 50,
    fontSize: 16,
    color: '#555',
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  moduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00008B',
    marginBottom: 4,
  },
  descText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});