import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../hooks/UserContext';

const FriendsScreen = ({ navigation }) => {
  const { user } = useUser();

  const renderFriend = ({ item }) => (
    <View style={styles.friendContainer}>
      <Image source={{ uri: item.profileImageUrl }} style={styles.friendAvatar} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.friendLocation}>{item.location}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={() => navigation.navigate('FriendProfile', { friend: item })}
      >
        <Text style={styles.viewProfileButtonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={user.friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriend}
        contentContainerStyle={styles.friendsList}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriend')}
      >
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  friendsList: {
    padding: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  friendLocation: {
    fontSize: 14,
    color: '#666',
  },
  viewProfileButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  viewProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FriendsScreen;
