import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const DetailScreen = ({ route }) => {
  const { entry } = route.params;

  const comments = [
    { id: 1, username: 'Friend1', text: 'Great post!', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', time: new Date(Date.now() - 30000) },
    { id: 2, username: 'Friend2', text: 'Interesting...', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', time: new Date(Date.now() - 61000) },
  ];

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
    <View style={styles.container}>
      <Text style={styles.title}>{entry.username}'s Words</Text>
      <View style={styles.entry}>
        <Image source={{ uri: entry.avatar }} style={styles.userAvatar} />
        <View style={styles.entryContent}>
          <Text style={styles.entryText}>{entry.text}</Text>
          <Text style={styles.entryMeta}>{entry.time} - {entry.location}</Text>
        </View>
      </View>
      <Text style={styles.commentsTitle}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={styles.commentTextContainer}>
              <Text style={styles.commentUsername}>{item.username}</Text>
              <Text style={styles.commentTime}>{getTimeAgo(new Date(item.time))}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        style={styles.commentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    position: 'relative',
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
  commentList: {
    marginTop: 10,
  },
});

export default DetailScreen;
