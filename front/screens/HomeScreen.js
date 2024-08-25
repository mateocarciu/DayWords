import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../hooks/UserContext";
import * as Haptics from "expo-haptics";

const HomeScreen = ({ navigation }) => {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [threadEntries, setThreadEntries] = useState([]);
  const [friendsEntries, setFriendsEntries] = useState([]);

  // Cette fonction se charge de récupérer les entrées de l'utilisateur
  const fetchUserEntries = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/entries", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const userEntries = await response.json();
      setThreadEntries(userEntries.filter((entry) => !entry.parent_entry_id));
    } catch (error) {
      console.error("Error fetching user entries:", error);
      Alert.alert("Error", "Failed to fetch user entries.");
    }
  };

  // Cette fonction se charge de récupérer les entrées des amis
  const fetchFriendsEntries = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/friends-entries", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const friendsEntries = await response.json();
      setFriendsEntries(friendsEntries);
    } catch (error) {
      console.error("Error fetching friends' entries:", error);
      Alert.alert("Error", "Failed to fetch friends' entries.");
    }
  };

  // Appeler les deux fetchers au chargement initial des données
  useEffect(() => {
    if (user.token) {
      fetchUserEntries();
      fetchFriendsEntries();
    }
  }, [user.token]);

  // Fonction pour sauvegarder une nouvelle entrée et refetch les entrées
  const handleSaveEntry = async (parentEntryId = null) => {
    if (text.trim() === "") {
      Alert.alert("Erreur", "Please type something before saving.");
      return;
    }

    Haptics.selectionAsync();

    const newEntryData = {
      text,
      parent_entry_id: parentEntryId,
    };

    try {
      await saveEntry(newEntryData);
      setText("");
      fetchUserEntries(); // Re-fetch seulement les entrées de l'utilisateur
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert("Error", "Could not save entry.");
    }
  };

  // Fonction pour ajouter une entrée dans un thread existant
  const addThreadEntry = () => {
    const parentEntryId = threadEntries[0]?.id;
    handleSaveEntry(parentEntryId);
  };

  // Fonction pour sauvegarder une entrée via l'API
  const saveEntry = async (entryData) => {
    try {
      const response = await fetch("http://localhost:8000/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(entryData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert("Error", "Could not save entry.");
      throw new Error("Failed to save entry");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("Profile");
          }}
        >
          <Image
            source={{ uri: user.data?.profileImageUrl }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>DayWords</Text>
        <TouchableOpacity
          style={styles.friendsButton}
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("Friends");
          }}
        >
          <MaterialIcons name="group" size={28} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.yourWordsContainer}>
          <Text style={styles.yourWordsTitle}>Your Words</Text>
          {threadEntries.length > 0 ? (
            <View>
              {threadEntries.map((entry) => (
                <View key={entry.id} style={styles.threadContainer}>
                  <TouchableOpacity
                    style={styles.entry}
                    onPress={() => {
                      Haptics.selectionAsync();
                      navigation.navigate("Detail", { entry });
                    }}
                  >
                    <Text style={styles.entryText}>{entry.text}</Text>
                    <FontAwesome
                      name="arrow-right"
                      size={20}
                      color="#6200ee"
                      style={styles.entryIcon}
                    />
                  </TouchableOpacity>
                  {entry.child_entries.map((child) => (
                    <View key={child.id} style={styles.childContainer}>
                      <View style={styles.threadLine} />
                      <View style={styles.childEntry}>
                        <Text style={styles.childEntryText}>{child.text}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Need to type something else ?..."
                  placeholderTextColor="#aaa"
                  value={text}
                  onChangeText={setText}
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                />
                <TouchableOpacity
                  style={[
                    styles.button,
                    text.trim() === "" && styles.buttonDisabled,
                  ]}
                  onPress={addThreadEntry}
                  disabled={text.trim() === ""}
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
                style={[
                  styles.button,
                  text.trim() === "" && styles.buttonDisabled,
                ]}
                onPress={() => handleSaveEntry()}
                disabled={text.trim() === ""}
              >
                <MaterialIcons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.friendsTitle}>Your Friends Words</Text>
        {friendsEntries.length > 0 ? (
          friendsEntries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.friendEntry}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate("Detail", { entry: item });
              }}
            >
              <Image
                source={{ uri: item.profileImageUrl }}
                style={styles.friendAvatar}
              />
              <View style={styles.friendTextContainer}>
                <Text style={styles.friendName}>{item.username}</Text>
                <Text style={styles.friendText}>
                  {item.text || "No entry today"}
                </Text>
                <Text style={styles.friendTime}>
                  {item.time || ""} - {item.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noFriendsText}>No friends entries found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: "center",
    zIndex: 1,
  },
  friendsButton: {
    position: "absolute",
    top: 22,
    left: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    position: "absolute",
    top: 22,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingTop: 70,
  },
  yourWordsContainer: {
    marginBottom: 25,
  },
  yourWordsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 25,
  },
  textArea: {
    flex: 1,
    paddingVertical: 10,
    color: "#333",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  threadContainer: {
    marginTop: 25,
    paddingBottom: 15,
  },
  entry: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  entryText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  entryIcon: {
    marginLeft: 10,
  },
  childContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  threadLine: {
    width: 2,
    backgroundColor: "#ddd",
    marginLeft: 28,
    marginTop: -5,
    marginBottom: -5,
  },
  childEntry: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginLeft: 10,
    flex: 1,
  },
  childEntryText: {
    fontSize: 14,
    color: "#555",
  },
  friendsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  friendEntry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
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
    fontWeight: "bold",
  },
  friendText: {
    fontSize: 14,
    color: "#666",
  },
  friendTime: {
    fontSize: 12,
    color: "#999",
  },
});

export default HomeScreen;
