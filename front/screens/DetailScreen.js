import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useUser } from '../hooks/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../config';


const DetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params; // Récupérez l'ID de l'entrée
  const { user } = useUser();
  const [entry, setEntry] = useState(null); // Stocker les détails de l'entrée
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (user.token && entryId) {
      fetchEntryDetails(); // Fetch les détails de l'entrée
      fetchComments();
    }
  }, [user.token, entryId]);

  const fetchEntryDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/entries/${entryId}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${user.token}`  },
      });
      const data = await response.json();
      setEntry(data);
    } catch (error) {
      console.error("Error fetching entry details:", error);
      Alert.alert("Error", "Failed to fetch entry details.");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments/${entryId}`, {
        headers: { Accept: 'application/json',
          Authorization: `Bearer ${user.token}`  },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      Alert.alert("Error", "Failed to fetch comments.");
    }
  };

  const postComment = async () => {
    if (commentText.trim() === '') {
      Alert.alert("Error", "Please enter a comment.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/comments/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${user.token}` ,
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      fetchComments(); // Re-fetch comments
      setCommentText(''); // Clear the input field

    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Could not post comment.");
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={22} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>{user.data.username}'s Words</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {entry ? (
          <>
            <View>
              <View style={styles.entry}>
                <Image source={{ uri: entry.user.profileImageUrl }} style={styles.userAvatar} />
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
                        {getTimeAgo(new Date(child_entry.created_at))} {entry?.location}
                      </Text>
                    </View>
                  </View>
                  {index !== entry.child_entries.length - 1 && <View style={styles.connector} />}
                </View>
              ))}
            </View>
            <Text style={styles.commentsTitle}>Comments</Text>
            {comments.map((item) => (
              <View key={item.id} style={styles.comment}>
                <Image source={{ uri: item.user.profileImageUrl }} style={styles.commentAvatar} />
                <View style={styles.commentTextContainer}>
                  <Text style={styles.commentUsername}>{item.user.username}</Text>
                  <Text style={styles.commentTime}>{getTimeAgo(new Date(item.created_at))}</Text>
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
        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={postComment}
        >
          {/* <Text style={styles.addCommentButtonText}>Post</Text> */}
          <MaterialIcons name="send" size={22} color="#fff" />

        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingTop: 120, // Ajustez ceci en fonction de la hauteur du header
    padding: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  entry: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  entryContent: {
    flex: 1,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  entryMeta: {
    fontSize: 12,
    color: '#888',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  connector: {
    height: 10,
    borderLeftWidth: 2,
    borderColor: '#6200ee',
    marginLeft: 36,
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default DetailScreen;