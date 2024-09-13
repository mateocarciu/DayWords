import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../hooks/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../config';
import * as Haptics from "expo-haptics";

const AddFriendScreen = ({ navigation }) => {
  const { user } = useUser();
  const [friendUsername, setfriendUsername] = useState('');

  const handleAddFriend = async () => {
    if (friendUsername.trim() === '') {
      Alert.alert('Erreur', 'Please enter a valid username.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/friends/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username: friendUsername }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert('Erreur', 'User not found.');
        } else if (response.status === 409) {
          Alert.alert('Erreur', 'Friend request already exists.');
        } else {
          throw new Error("Failed to send friend request");
        }
        return;
      }

      const data = await response.json();
      Alert.alert('Succès', 'Friend request sent.');
      setfriendUsername(''); // Clear the input field
      navigation.goBack();

    } catch (error) {
      console.error("Error adding friend:", error);
      Alert.alert("Erreur", "Could not send friend request.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.selectionAsync();
              navigation.goBack();
            }}
          >
            <MaterialIcons name="arrow-back" size={28} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Add a friend</Text>
      </View>
      <TextInput
        placeholder="Search by username"
        value={friendUsername}
        onChangeText={setfriendUsername}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, friendUsername.trim() === '' && styles.buttonDisabled]}
        onPress={handleAddFriend}
        disabled={friendUsername.trim() === ''}
      >
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AddFriendScreen;
