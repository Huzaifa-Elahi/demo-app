import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => Logout()}>
          <Image
            source={require("demo_app/assets/logout.png")}
            style={{
              marginTop: 0,
              marginRight: 10,
              width: 30,
              height: 20,
              justifyContent: "center",
            }}
          />
        </TouchableOpacity>
      ),
    });
    const Logout = () => {
      
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigation.replace("Login");
        })
        .catch((error) => {
          // An error happened.
          
        });
    };
  }, []);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
