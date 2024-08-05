import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../hooks/UserContext'; // Importez le hook useUser

const ProfileScreen = ({ navigation }) => {
  const { user } = useUser(); // Utilisez le hook useUser pour accéder aux données utilisateur

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.location}>{user.location}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#888',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ProfileScreen;
