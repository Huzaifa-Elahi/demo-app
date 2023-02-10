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
  import React,{useState} from "react";
  import { auth } from "../../firebase/firebase.config";
  import {createUserWithEmailAndPassword } from "firebase/auth";
  
  
  const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const signup = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          alert("User Registered Successfully");
          navigation.replace("Home");
        //   const user = userCredential.user;
          // ...
        })
        .catch((error) => {
            
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
    };
    return (
      <SafeAreaView>
        {/* <Text>Register</Text> */}
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
  
          <Text style={{ fontSize: 40, fontWeight: "bold" }}>Register</Text>
  
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
              onPress={()=>signup()}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Register</Text>
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
              
                onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
            </TouchableOpacity>
   
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default SignupScreen;
  
  const styles = StyleSheet.create({});
  