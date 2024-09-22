import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useUser } from '../hooks/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../config';
import * as Haptics from "expo-haptics";
import ProfilePicture from '../components/ProfilePicture';

const AddFriendScreen = ({ navigation }) => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fonction pour chercher des utilisateurs en fonction du username
  const searchUsers = async (username) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/search?searchTerm=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
  
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };  

  // Déclenche la recherche chaque fois que le terme de recherche change
  useEffect(() => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    } else {
      setSearchResults([]); // Effacer les résultats si le champ est vide
    }
  }, [searchTerm]);  

  // Fonction pour ajouter un ami
  const handleAddFriend = async (username) => {
    try {
      const response = await fetch(`${API_URL}/api/friends/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert('Erreur', 'User not found.');
        } else if (response.status === 409) {
          Alert.alert('Erreur', 'Friend request already exists.');
        } else {
          throw new Error('Failed to send friend request');
        }
        return;
      }

      Alert.alert('Succès', 'Friend request sent.');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Erreur', 'Could not send friend request.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultText}>{item.username}</Text>
      {item.isFriend ? (
        <Text style={styles.alreadyFriend}>Already Friends</Text>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriend(item.username)}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  resultsList: {
    marginTop: 20,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
  },
  alreadyFriend: {
    color: 'green',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  header: {
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
