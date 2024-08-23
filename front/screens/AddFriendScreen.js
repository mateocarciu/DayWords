import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AddFriendScreen = ({ navigation }) => {
  const [friendEmail, setFriendEmail] = useState('');

  const handleAddFriend = () => {
    if (friendEmail.trim() === '') {
      Alert.alert('Erreur', 'Please enter a valid email address.');
      return;
    }

    // Logique pour ajouter un ami (plus tard, on utilisera une API)
    // For now, just reset the email and go back
    setFriendEmail('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friend</Text>
      <TextInput
        placeholder="Friend's Email"
        value={friendEmail}
        onChangeText={setFriendEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, friendEmail.trim() === '' && styles.buttonDisabled]}
        onPress={handleAddFriend}
        disabled={friendEmail.trim() === ''}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
});

export default AddFriendScreen;
