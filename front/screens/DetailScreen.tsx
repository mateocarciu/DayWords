import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useUser } from "../hooks/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ProfilePicture from "../components/ProfilePicture";

const DetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { user } = useUser();
  const [entry, setEntry] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (user.token && entryId) {
      fetchEntryDetails();
    }
  }, [user.token, entryId]);

  const fetchEntryDetails = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/entries/${entryId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setEntry(data);
    } catch (error) {
      console.error("Error fetching entry details:", error);
      Alert.alert("Error", "Failed to fetch entry details.");
    }
  };

  const postComment = async () => {
    if (commentText.trim() === "") {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    try {
      const response = await fetch(`${process.env.API_URL}/api/comments/${entryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      fetchEntryDetails();
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Could not post comment.");
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
    }
  };
  const navigateToUserProfile = (userId) => {
    Haptics.selectionAsync();
    if (userId === user.data.id) {
      navigation.navigate("Profile"); // Redirection vers la page ProfileScreen
      return;
    }
    navigation.navigate("UserProfile", { userId }); // Redirection vers la page UserProfileScreen avec l'ID de l'utilisateur
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        <Text style={styles.title}>
          {entry && entry.user
            ? entry.user.id === user.data.id
              ? "Your Words"
              : `${entry.user.username}'s Words`
            : "Loading..."}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {entry ? (
          <>
            <View>
              <View style={styles.entry}>
                <TouchableOpacity
                  onPress={() => navigateToUserProfile(entry.user.id)}
                >
                  <ProfilePicture
                    profileImageUrl={entry.user.profileImageUrl}
                    username={entry.user.username}
                    size={50}
                    hasMarginRight
                  />
                </TouchableOpacity>
                <View style={styles.entryContent}>
                  <Text style={styles.entryText}>{entry.text}</Text>
                  <Text style={styles.entryMeta}>
                    {getTimeAgo(new Date(entry.created_at))} {entry?.location}
                  </Text>
                </View>
              </View>
              {entry.child_entries.map((child_entry, index) => (
                <View key={child_entry.id}>
                  <View style={styles.connector} />
                  <View style={styles.entry}>
                    <View style={styles.entryContent}>
                      <Text style={styles.entryText}>{child_entry.text}</Text>
                      <Text style={styles.entryMeta}>
                        {getTimeAgo(new Date(child_entry.created_at))}{" "}
                        {entry?.location}
                      </Text>
                    </View>
                  </View>
                  {index !== entry.child_entries.length - 1 && (
                    <View style={styles.connector} />
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.commentsTitle}>Comments</Text>
            {entry.comments.map((item) => (
              <View key={item.id} style={styles.comment}>
                <TouchableOpacity
                  onPress={() => navigateToUserProfile(item.user.id)}
                >
                  <Image
                    source={{ uri: process.env.API_URL + item.user.profileImageUrl }}
                  />
                  <ProfilePicture
                    profileImageUrl={item.user?.profileImageUrl}
                    username={item.user?.username}
                    size={50}
                    hasMarginRight
                  />
                </TouchableOpacity>
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUsername}>
                    {item.user.username}
                  </Text>
                  <Text style={styles.commentTime}>
                    {getTimeAgo(new Date(item.created_at))}
                  </Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.loadingText}>Loading entry details...</Text>
        )}
      </ScrollView>
      <View style={styles.addCommentContainer}>
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#aaa"
          value={commentText}
          onChangeText={setCommentText}
          style={styles.commentInput}
        />
        <TouchableOpacity style={styles.addCommentButton} onPress={postComment}>
          <MaterialIcons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingTop: 120, // Ajustez ceci en fonction de la hauteur du header
    padding: 20,
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
    alignItems: "flex-start",
    marginBottom: 0,
  },
  entryContent: {
    flex: 1,
  },
  entryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  entryMeta: {
    fontSize: 12,
    color: "#888",
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  comment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentTime: {
    fontSize: 12,
    color: "#888",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addCommentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  connector: {
    height: 10,
    borderLeftWidth: 2,
    borderColor: "#6200ee",
    marginLeft: 36,
  },
  loadingText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default DetailScreen;
