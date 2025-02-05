import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useUser } from "../hooks/UserContext";
import * as Haptics from "expo-haptics";
import ProfilePicture from "../components/ProfilePicture";

const FriendsScreen = ({ navigation }) => {
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "friends", title: "Friends" },
    { key: "requests", title: "Requests" },
  ]);

  useEffect(() => {
    if (user.token) {
      fetchUserFriends();
      fetchFriendRequests();
    }
  }, [user.token]);

  useEffect(() => {
    if (user.token) {
      fetchUserFriends();
      fetchFriendRequests();
    }
  }, [user.token]);

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else {
      setSearchResults([]); // Clear search results when input is empty
    }
  }, [searchTerm]);

  const confirmDeleteFriend = (friendId) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => deleteFriend(friendId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const deleteFriend = async (friendId) => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/friends/${friendId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete friend");

      fetchUserFriends();
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  const searchUsers = async (username) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/users/search?searchTerm=${encodeURIComponent(
          username
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Fonction pour ajouter un ami
  const handleAddFriend = async (username) => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/friends/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert("Erreur", "User not found.");
        } else if (response.status === 409) {
          Alert.alert("Erreur", "Friend request already exists.");
        } else {
          throw new Error("Failed to send friend request");
        }
        return;
      }

      Alert.alert("Succès", "Friend request sent.");
    } catch (error) {
      console.error("Error adding friend:", error);
      Alert.alert("Erreur", "Could not send friend request.");
    }
  };

  const renderSearchResults = () => (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserProfile", { userId: item.id })
            }
          >
            <ProfilePicture
              profileImageUrl={item.profileImageUrl}
              username={item.username}
              size={50}
              hasMarginRight
            />
          </TouchableOpacity>

          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.username}</Text>
          </View>
          {!item.isFriend && (
            <TouchableOpacity onPress={() => handleAddFriend(item.username)}>
              <MaterialIcons name="person-add" size={28} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      )}
      contentContainerStyle={styles.friendsList}
    />
  );

  const FriendsList = () => (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserProfile", { userId: item.id })
            }
          >
            <ProfilePicture
              profileImageUrl={item.profileImageUrl}
              username={item.username}
              size={50}
              hasMarginRight
            />
          </TouchableOpacity>
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.username}</Text>
          </View>
          <TouchableOpacity onPress={() => confirmDeleteFriend(item.id)}>
            <MaterialIcons name="clear" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.friendsList}
    />
  );

  const FriendRequestsList = () => (
    <FlatList
      data={friendRequests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendContainer}>
          <ProfilePicture
            profileImageUrl={item.sender.profileImageUrl}
            username={item.sender.username}
            size={50}
            hasMarginRight
          />
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{item.sender.username}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleRequest(item.id, "accept")}
            >
              <AntDesign name="check" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleRequest(item.id, "reject")}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      contentContainerStyle={styles.friendsList}
    />
  );

  const fetchUserFriends = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/friends`, {
        headers: {
          Accept: "application/json",
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
      const response = await fetch(`${process.env.API_URL}/api/friend-requests`, {
        headers: {
          Accept: "application/json",
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
      const response = await fetch(`${process.env.API_URL}/api/friend-requests/${id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to update friend request");
      const message =
        action === "accept"
          ? "Friend request accepted"
          : "Friend request rejected";
      Alert.alert("Success", message);
      fetchFriendRequests();
      fetchUserFriends();
    } catch (error) {
      console.error("Error handling friend request:", error);
      Alert.alert("Error", "Failed to update friend request.");
    }
  };

  const renderScene = SceneMap({
    friends: () => (searchTerm ? renderSearchResults() : <FriendsList />),
    requests: () => <FriendRequestsList />,
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
      <View style={styles.searchBarContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color="#aaa"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      <View style={styles.tabViewContainer}>
        {searchTerm.length === 0 ? (
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "#6200ee" }}
                style={{ backgroundColor: "white" }}
                // labelStyle={{ color: "#6200ee", fontWeight: "bold" }}
              />
            )}
          />
        ) : (
          renderSearchResults()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 120,
  },
  tabViewContainer: {
    flex: 1,
    marginHorizontal: 15, // Ajoute des marges sur les côtés pour un effet de carte
    borderRadius: 10, // Arrondit les coins du TabView
    overflow: "hidden", // Assure que le contenu reste dans les limites arrondies
    backgroundColor: "#ffffff", // Fond blanc pour le TabView
    elevation: 5, // Ajoute une légère ombre
  },
  friendsList: {
    padding: 20,
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  friendLocation: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 20,
  },
  viewProfileButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  viewProfileButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    height: 80,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", // Fond blanc pour le conteneur
    borderRadius: 20, // Coins arrondis
    elevation: 4, // Ombre légère
    paddingHorizontal: 15, // Espacement à l'intérieur
    marginBottom: 20, // Espace en bas
    marginHorizontal: 15, // Espace sur les côtés
  },
  searchBar: {
    flex: 1, // Prend tout l'espace disponible
    height: 45, // Hauteur de la barre
    borderRadius: 30, // Coins arrondis
    paddingHorizontal: 10, // Espacement interne
    color: "#333", // Couleur du texte
    fontSize: 16, // Taille de police
  },
  searchIcon: {
    marginRight: 10, // Espacement entre l'icône et le champ de texte
  },
});

export default FriendsScreen;
