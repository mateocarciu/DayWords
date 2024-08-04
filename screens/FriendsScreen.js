import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const FriendsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Friends</Text>
      <Button title="Add Friend" onPress={() => navigation.navigate('AddFriend')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsScreen;
