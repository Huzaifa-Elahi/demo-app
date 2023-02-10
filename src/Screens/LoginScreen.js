import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
// import { Provider as PaperProvider } from 'react-native-paper';
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
  }, []);
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        alert("User Login Succesfully");
        navigation.replace("Home");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const resetPassword = () => {
    if (email != null) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("Password reset email has been sent successfully");
          // Password reset email sent!
          // ..
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    } else {
      alert("Please enter a valid email");
    }
  };
  return (
    <SafeAreaView>
      {/* <Text>Hi</Text> */}
      <View style={{ alignItems: "center", margin: 20 }}>
        <Image
          source={require("demo_app/assets/logo.png")}
          style={{
            marginTop: 50,
            marginLeft: 50,
            width: 350,
            height: 200,
            justifyContent: "center",
          }}
        />

        <Text style={{ fontSize: 40, fontWeight: "bold" }}>Login</Text>

        <TextInput
          label="Email"
          mode="outlined"
          outlineColor="#39d5a2"
          activeOutlineColor="#39d5a2"
          style={{
            width: "100%",
            marginVertical: 20,
            backgroundColor: "#ecf8f4",
          }}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          outlineColor="#39d5a2"
          activeOutlineColor="#39d5a2"
          style={{ width: "100%", backgroundColor: "#ecf8f4" }}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "#DDDDDD",
              padding: 10,
              marginTop: 40,
              width: "40%",
              height: 45,
              backgroundColor: "#39d5a2",
              borderRadius: 50,
              marginHorizontal: 20,
            }}
            onPress={() => login()}
            // onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "#DDDDDD",
              padding: 10,
              marginTop: 40,
              width: "40%",
              height: 45,
              backgroundColor: "#39d5a2",
              borderRadius: 50,
              marginHorizontal: 20,
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Register</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            margin: 10,
            marginTop: 30,
            alignItems: "center",
          }}
          onPress={() => resetPassword()}
        >
          <Text>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
