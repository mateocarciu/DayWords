import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [entry, setEntry] = useState(null);

  const friendsEntries = [
    { id: 1, username: 'JohnDoe', text: 'Had a great day thank you varikars, yes yes shkipdopdop ppap pa pap pap appa ppa !', time: '14:30', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', location: 'New York, USA' },
    { id: 2, username: 'JaneSmith', text: 'Visited a beautiful park.', time: '15:45', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'London, UK' },
    { id: 3, username: 'kar', text: 'Visited a beautiful park.', time: '15:45', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'London, UK' },
    { id: 4, username: 'smith', text: 'Visited johhny sins yesterday, it was awesome :)).', time: '15:00', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', location: 'LA, USA' },
    { id: 5, username: 'smith', text: 'Visited a beautiful park.', time: '15:45', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', location: 'London, UK' },
  ];

  const handleSave = () => {
    try {
      if (text.trim() === '') {
        Alert.alert('Error', 'Please write something about your day before sending.');
        return;
      }
      const newEntry = { id: 1, username: "Morue69", text, time: new Date().toLocaleTimeString(), location: 'Paris, France', avatar:'https://randomuser.me/api/portraits/men/3.jpg' };
      setEntry(newEntry);
      setText('');
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving your entry.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }} // Utiliser une vraie photo de profil
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>DayWords</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} // Masquer la barre de défilement
      >
        <View style={styles.yourWordsContainer}>
          <Text style={styles.yourWordsTitle}>Your Words</Text>
          {!entry ? (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Write something about your day..."
                  placeholderTextColor="#aaa"
                  value={text}
                  onChangeText={setText}
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                />
                <TouchableOpacity 
                  style={[styles.button, text.trim() === '' && styles.buttonDisabled]} 
                  onPress={handleSave}
                  disabled={text.trim() === ''}
                >
                  <MaterialIcons name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.entry}
              onPress={() => navigation.navigate('Detail', { entry })}
            >
              <Text style={styles.entryText}>{entry.text}</Text>
              <FontAwesome name="arrow-right" size={20} color="#6200ee" style={styles.entryIcon} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.friendsTitle}>Friends Words</Text>
        {friendsEntries.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.friendEntry}
            onPress={() => navigation.navigate('Detail', { entry: item })}
          >
            <Image source={{ uri: item.avatar }} style={styles.friendAvatar} />
            <View style={styles.friendTextContainer}>
              <Text style={styles.friendUsername}>{item.username}</Text>
              <Text style={styles.friendTime}>{item.time} - {item.location}</Text>
              <Text style={styles.friendText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    zIndex: 1, // Pour s'assurer que le header est au-dessus du contenu
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    marginTop: 1, // Décalage pour éviter que le contenu ne passe sous le header fixe
  },
  scrollContent: {
    paddingTop: 70, // Assurez-vous que le contenu commence après le header fixe
  },
  yourWordsContainer: {
    marginBottom: 25,
  },
  yourWordsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 25,
  },
  textArea: {
    flex: 1,
    paddingVertical: 10,
    color: '#333',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  entry: {
    marginTop: 25,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  entryIcon: {
    marginLeft: 10,
  },
  friendsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  friendEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendTextContainer: {
    flex: 1,
  },
  friendUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendTime: {
    fontSize: 12,
    color: '#888',
  },
  friendText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default HomeScreen;
