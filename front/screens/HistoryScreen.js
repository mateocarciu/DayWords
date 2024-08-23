import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const HistoryScreen = ({ route }) => {
  const { entries } = route.params;

  return (
    <View style={styles.container}>
      <Text>History</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HistoryScreen;
