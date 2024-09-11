import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useUser } from '../hooks/UserContext';
import { API_URL } from '../config';
import * as Haptics from "expo-haptics";


const FriendsList = ({ friends, navigation }) => (
  <FlatList
    data={friends}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
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
    )}
    contentContainerStyle={styles.friendsList}
  />
);

const FriendRequestsList = ({ friendRequests, handleRequest }) => (
  <FlatList
    data={friendRequests}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.friendContainer}>
        <Image source={{ uri: item.sender.profileImageUrl }} style={styles.friendAvatar} />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.sender.username}</Text>
          <Text style={styles.friendLocation}>{item.location}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleRequest(item.id, 'accept')}
          >
            <AntDesign name="check" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleRequest(item.id, 'reject')}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )}
    contentContainerStyle={styles.friendsList}
  />
);

const FriendsScreen = ({ navigation }) => {
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'friends', title: 'Friends' },
    { key: 'requests', title: 'Requests' },
  ]);

  useEffect(() => {
    if (user.token) {
      fetchUserFriends();
      fetchFriendRequests();
    }
  }, [user.token]);

  const fetchUserFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friends`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch friends");
      const friendsData = await response.json();
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching user friends:", error);
      Alert.alert("Error", "Failed to fetch user friends.");
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friend-requests`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch friend requests");
      const requestsData = await response.json();
      setFriendRequests(requestsData);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      Alert.alert("Error", "Failed to fetch friend requests.");
    }
  };

  const handleRequest = async (id, action) => {
    try {
      const response = await fetch(`${API_URL}/api/friend-requests/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to update friend request");
      const message = action === 'accept' ? 'Friend request accepted' : 'Friend request rejected';
      Alert.alert('Success', message);
      fetchFriendRequests(); // Refresh the list of friend requests after action
      fetchUserFriends(); // Refresh the list of friend requests after action
    } catch (error) {
      console.error("Error handling friend request:", error);
      Alert.alert("Error", "Failed to update friend request.");
    }
  };

  const renderScene = SceneMap({
    friends: () => <FriendsList friends={friends} navigation={navigation} />,
    requests: () => <FriendRequestsList friendRequests={friendRequests} handleRequest={handleRequest} />,
  });

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
        <Text style={styles.title}>Friends</Text>
      </View>
      <View style={styles.tabViewContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#6200ee' }}
              style={{ backgroundColor: 'white' }}
              labelStyle={{ color: '#6200ee', fontWeight: 'bold' }}
            />
          )}
        />
      </View>
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
    paddingTop: 120,
  },
  tabViewContainer: {
    flex: 1,
    marginHorizontal: 15, // Ajoute des marges sur les côtés pour un effet de carte
    borderRadius: 10, // Arrondit les coins du TabView
    overflow: 'hidden', // Assure que le contenu reste dans les limites arrondies
    backgroundColor: '#ffffff', // Fond blanc pour le TabView
    elevation: 5, // Ajoute une légère ombre
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
  actionButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 20,
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

export default FriendsScreen;