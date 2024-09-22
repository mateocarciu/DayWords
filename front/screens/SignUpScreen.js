import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../config";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    formData.append("profileImage", profileImage);
    // Vérifiez si l'image est présente et formatez-la correctement
    // if (profileImage) {
    //   const uriParts = profileImage.split('.');
    //   const fileType = uriParts[uriParts.length - 1];

    //   formData.append('profileImage', {
    //     uri: profileImage,
    //     name: `profile.${fileType}`,
    //     type: `image/${fileType}`,
    //   });
    // }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // Ne pas définir 'Content-Type' ici car FormData s'en charge
        },
        body: formData,
      });

      if (!response.ok) {
        Alert.alert("OOPS Couldn't register");
      } else {
        Alert.alert("Sign Up", "User registered successfully");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Erreur", "Registration failed.");
    }
  };
  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity onPress={selectImage}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.imagePlaceholder}>Select Profile Image</Text>
            )}
          </View>
        </TouchableOpacity>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
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
        <TextInput
          placeholder="Password confirmation"
          placeholderTextColor="#aaa"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#6200ee",
    fontSize: 14,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: "#aaa",
  },
});

export default SignUpScreen;
