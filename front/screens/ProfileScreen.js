import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../hooks/UserContext';
import * as Haptics from "expo-haptics";
import { API_URL } from '../config';



const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useUser(); // Récupérez la fonction logout

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

    // Fonction pour obtenir les initiales
  const getInitials = (username) => {
    if (!username) return ''; // Si le nom d'utilisateur est vide
    const nameParts = username.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase(); // Si une seule partie, retourne la première lettre
    }
    return (
      nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase() // Retourne les deux premières lettres des noms
    );
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
        <Text style={styles.title}>Profile</Text>
      </View>


      <View style={styles.profileContainer}>
        { user.data?.profileImageUrl? (
          <Image
            source={{ uri: API_URL +  user.data?.profileImageUrl }}
            style={styles.profileImage}
          />
        ) : (
          // Si aucune image de profil n'est disponible, créer une vue avec les initiales
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileInitials}>
              {getInitials( user.data?.username)}
            </Text>
          </View>
        )}
        <Text style={styles.username}>{user.data?.username}</Text>
        <Text style={styles.location}>{user.data?.location}</Text>
        <Text style={styles.bio}>{user.data?.bio}</Text>
      </View>
      {/* Ajoutez le bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Pour arrondir l'image
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF5733', // Couleur de fond par défaut
    alignItems: 'center',
    justifyContent: 'center',

  },
  profileInitials: {
    color: '#FFFFFF', // Couleur du texte
    fontSize: 24,
    fontWeight: 'bold',
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
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
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

export default ProfileScreen;
