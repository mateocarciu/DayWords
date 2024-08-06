import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../hooks/UserContext';

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [text, setText] = useState('');
  const [threadEntries, setThreadEntries] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const entry = user.entries.find(e => e.date === today && e.parentEntry === null);
    setThreadEntries(entry ? [entry, ...user.entries.filter(e => e.parentEntry === entry.id)] : []);
  }, [user.entries]);

  const handleSave = (parentEntryId = null) => {
    if (text.trim() === '') {
      Alert.alert('Erreur', 'Please type something before saving.');
      return;
    }

    const newEntry = {
      id: user.entries.length + 1,
      username: user.username,
      text,
      time: new Date().toLocaleTimeString(),
      date: new Date().toISOString().split('T')[0],
      location: user.location,
      profileImageUrl: user.profileImageUrl,
      emotion: null,
      mediaUrl: '',
      isPublic: true,
      parentEntry: parentEntryId,
      comments: []
    };

    setUser({ ...user, entries: [...user.entries, newEntry] });
    setText('');
  };

  const addThreadEntry = () => {
    const parentEntryId = threadEntries[0]?.id;
    handleSave(parentEntryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: user.profileImageUrl }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>DayWords</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.yourWordsContainer}>
          <Text style={styles.yourWordsTitle}>Vos mots</Text>
          {threadEntries.length > 0 ? (
            <View>
              {threadEntries.slice(0, 1).map((entry, index) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.entry}
                  onPress={() => navigation.navigate('Detail', { entry })}
                >
                  <Text style={styles.entryText}>{entry.text}</Text>
                  <FontAwesome name="arrow-right" size={20} color="#6200ee" style={styles.entryIcon} />
                </TouchableOpacity>
              ))}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Start a thread..."
                  placeholderTextColor="#aaa"
                  value={text}
                  onChangeText={setText}
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                />
                <TouchableOpacity 
                  style={[styles.button, text.trim() === '' && styles.buttonDisabled]} 
                  onPress={addThreadEntry}
                  disabled={text.trim() === ''}
                >
                  <MaterialIcons name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Type something about your day..."
                placeholderTextColor="#aaa"
                value={text}
                onChangeText={setText}
                style={styles.textArea}
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity 
                style={[styles.button, text.trim() === '' && styles.buttonDisabled]} 
                onPress={() => handleSave()}
                disabled={text.trim() === ''}
              >
                <MaterialIcons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.friendsTitle}>Les mots de vos amis</Text>
        {user.friends.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.friendEntry}
            onPress={() => navigation.navigate('Detail', { entry: item })}
          >
            <Image source={{ uri: item.profileImageUrl }} style={styles.friendAvatar} />
            <View style={styles.friendTextContainer}>
              <Text style={styles.friendName}>{item.username}</Text>
              <Text style={styles.friendText}>{item.text || 'No entry today'}</Text>
              <Text style={styles.friendTime}>{item.time || ''} - {item.location}</Text>
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
    zIndex: 1,
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
    marginTop: 1,
  },
  scrollContent: {
    paddingTop: 70,
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
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendText: {
    fontSize: 14,
    color: '#666',
  },
  friendTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
