import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useUser } from '../hooks/UserContext';
import { MaterialIcons } from '@expo/vector-icons';


const DetailScreen = ({ route, navigation }) => {
  const { entry } = route.params;
  const { user } = useUser();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (user.token && entry.id) {
      fetchComments();
    }
  }, [user.token, entry.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/${entry.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      Alert.alert("Error", "Failed to fetch comments.");
    }
  };

  // Function to get elapsed time
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{user.data.username}'s Words</Text>
        {entry && (
          <View>
            <View style={styles.entry}>
              <Image source={{ uri: user.data.profileImageUrl }} style={styles.userAvatar} />
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
        )}
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
        >
          <Text style={styles.addCommentButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    height: 20,
    borderLeftWidth: 2,
    borderColor: '#6200ee',
    marginLeft: 36,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default DetailScreen;
