import { StyleSheet, Text, View, Image,Dimensions,Button } from "react-native";
import React, { useEffect, useState } from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../../firebase/firebase.config";
import { firestore } from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Permissions from 'expo-permissions';

const HomeScreen = ({ navigation }) => {

  var docRef = firestore.collection("locationDetails").doc(area);
  docRef.get().then(function(doc) {
    if (doc.exists) {
      console.log(doc.data());
    } else {
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
  
  const [mapRegion, setMapRegion]=useState({
    
    latitude:24.860735,
    longitude:67.001137,
    latitudeDelta:0.0922,
    longitudeDelta:0.0421,
  });
  const [circleCenter, setCircleCenter]=useState({
    latitude:24.860735,
    longitude:67.001137,
  });
  // sdd
  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    try {
      const locationsRef = firestore.collection("locationDetails");
      const locationsSnapshot = await locationsRef.get();
      setLocations(locationsSnapshot.docs.map(doc => doc.data()));
    } catch (error) {
      console.error(error);
    }
  };
  // sdsds

  const UserLocation = async()=>{
    let {status}=await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      setErrorMsg('Permission to access location was denied!')
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true});

    setMapRegion({

        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      

    });
    console.log(location.coords.latitude,location.coords.longitude);
    setCircleCenter({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }
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
          navigation.replace("Login");
        })
        .catch((error) => {
          // An error happened.
        });
    };

    UserLocation();
    getLocations();
    
  }, []);
  

 
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={mapRegion} title="Marker" />
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}
            title={location.title}
          />
        ))}
        <Circle
            center={ circleCenter}
          // center={{ latitude:location.coords.latitude, longitude: location.coords.longitude }}
          radius={1000}
          fillColor="rgba(0, 160, 0, 0.5)"
          strokeColor="rgba(0, 0, 255, 0.5)"
          strokeWidth={1}
        />
      </MapView>

      <Button title="Get Location" onPress={UserLocation} />
    </View>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
  },
  map:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },


});

