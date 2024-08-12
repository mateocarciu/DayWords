import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useUser } from '../hooks/UserContext';

const DetailScreen = ({ route }) => {
  const { entry } = route.params;
  const { user } = useUser();
  const [commentText, setCommentText] = useState('');

  // Récupérer le thread entier à partir de l'entrée initiale
  const getThread = (entryId) => {
    return user.entries.filter(e => e.parentEntry === entryId || e.id === entryId).sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const thread = getThread(entry.id);

  // Simulated comments (you can replace this with actual data from your backend)
  const [comments] = useState([
    { id: 1, username: 'Friend1', text: 'Great post!', profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg', time: new Date(Date.now() - 30000) },
    { id: 2, username: 'Friend2', text: 'Interesting...', profileImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', time: new Date(Date.now() - 61000) },
    { id: 3, username: 'Friend3', text: 'Nice work!', profileImageUrl: 'https://randomuser.me/api/portraits/men/2.jpg', time: new Date(Date.now() - 90000) },
    { id: 4, username: 'Friend4', text: 'Keep it up!', profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg', time: new Date(Date.now() - 120000) },
  ]);

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{entry.username}'s Words</Text>
        <View>
          {thread.map((post, index) => (
            <View key={post.id}>
              <View style={styles.entry}>
                <Image source={{ uri: post.profileImageUrl }} style={styles.userAvatar} />
                <View style={styles.entryContent}>
                  <Text style={styles.entryText}>{post.text}</Text>
                  <Text style={styles.entryMeta}>{getTimeAgo(new Date(post.time))} - {post.location}</Text>
                </View>
              </View>
              {index !== thread.length - 1 && <View style={styles.connector} />}
            </View>
          ))}
        </View>
        <Text style={styles.commentsTitle}>Comments</Text>
        {comments.map((item) => (
          <View key={item.id} style={styles.comment}>
            <Image source={{ uri: item.profileImageUrl }} style={styles.commentAvatar} />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentTime}>{getTimeAgo(new Date(item.time))}</Text>
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
  // threadContainer: {
  //   paddingLeft: 10,
  //   borderLeftWidth: 2,
  //   borderColor: '#6200ee',
  // },
  // postContainer: {
  //   marginBottom: 1,
  // },
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
});

export default DetailScreen;