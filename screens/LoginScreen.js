import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    try {
      // Ici tu pourrais ajouter la logique réelle pour se connecter, par exemple :
      // const response = await loginUser(email, password);
      // if (response.success) {
      //   navigation.navigate('Home');
      // } else {
      //   throw new Error('Login failed');
      // }

      // Pour l'instant, simplement naviguer vers Home
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Error', 'An error occurred while trying to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DayWords</Text>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email or Username"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#6200ee',
    fontSize: 14,
  },
});

export default LoginScreen;
