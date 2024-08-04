import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddFriendScreen = ({ navigation }) => {
  const [friendEmail, setFriendEmail] = useState('');

  const handleAddFriend = () => {
    // Logique pour ajouter un ami (plus tard, on utilisera une API)
    setFriendEmail('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Add Friend</Text>
      <TextInput
        placeholder="Friend's Email"
        value={friendEmail}
        onChangeText={setFriendEmail}
        style={styles.input}
      />
      <Button title="Add" onPress={handleAddFriend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default AddFriendScreen;
