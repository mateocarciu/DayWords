import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { API_URL } from "../config";
import { useUser } from "../hooks/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ProfilePicture from "../components/ProfilePicture";

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [friendData, setFriendData] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (user.token && userId) {
      fetchFriendData();
    }
  }, [userId]);

  // Fonction pour récupérer les informations du profil de l'utilisateur
  const fetchFriendData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/friends/${userId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setFriendData(data);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    }
  };

  if (!friendData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      </View>
      <View style={styles.profileHeader}>
        <ProfilePicture
          profileImageUrl={friendData.profileImageUrl}
          username={friendData.username}
          size={100}
        />
        <Text style={styles.username}>{friendData.username}</Text>
        <Text style={styles.name}>{friendData.name}</Text>
        <Text style={styles.bio}>{friendData.bio}</Text>
        {friendData.location && (
          <Text style={styles.infoText}>Location: {friendData.location}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
    top: 80,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 18,
    color: "#666",
  },
  bio: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default UserProfileScreen;
