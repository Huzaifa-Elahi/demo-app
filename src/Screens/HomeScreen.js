import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Button,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../../firebase/firebase.config";
import { firestore, doc, getDocs, collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import * as Location from "expo-location";
import MapView, { Marker, Circle, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";

const HomeScreen = ({ navigation }) => {
  // const [modalVisible, setModalVisible] = useState(false);

  // const handleMarkerPress = () => {
  //   setModalVisible(true);
  // };
  const [currentMarker ,setcurrentMarker]=useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalClose = () => {
      setModalVisible(false);
      console.log('closed');
    // code to handle closing the modal
  };

  const [locationDetailsArray, setLocationDetailsArray] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 24.860735,
    longitude: 67.001137,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [circleCenter, setCircleCenter] = useState({
    latitude: 24.860735,
    longitude: 67.001137,
  });

  const ReadData = async () => {
    const querySnapshot = await getDocs(collection(db, "locationDetails"));
    const locationDetailsArray = [];
    querySnapshot.forEach((doc) => {
      locationDetailsArray.push({
        id: doc.id,
        // geolocation: doc.data().geolocation,
        longitude: doc.data().longitude,
        latitude: doc.data().latitude,
        name: doc.data().name,
        area: doc.data().area,
        fajr: doc.data().fajr,
        zohr: doc.data().zohr,
        asr: doc.data().asr,
        maghrib: doc.data().maghrib,
        isha: doc.data().isha,
        jumma: doc.data().jumma,
        url: doc.data().url,
      });

      // console.log(doc.name);

      // console.log(doc.longitude);
      // const geoArray=doc.data().geolocation
      // console.log(geolocation.latitude);
      // console.log(geoArray);
    });
    // console.log("Longitude:", doc.longitude);

    // console.log(locationDetailsArray);

    setLocationDetailsArray(locationDetailsArray);
  };

  const UserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied!");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
    setCircleCenter({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };
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
    ReadData();
  }, []);
  const handleMarkerPress =(location)=>{
    setModalVisible(true),
    setcurrentMarker(location)
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={mapRegion} title="Marker" pinColor="yellow" />
        <Circle
          center={circleCenter}
          radius={1000}
          fillColor="rgba(0, 160, 0, 0.5)"
          strokeColor="rgba(0, 0, 255, 0.5)"
          strokeWidth={1}
        />
        {locationDetailsArray.map((location) => {
          if (location.latitude && location.longitude) {
            return (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.name}
                // image={location.url}
                onPress={() => handleMarkerPress(location)
                // console.log(onPress)
                }
                
                // onPress={handleMarkerPress}
              />
            );
          } else {
            console.log(
              `Invalid coordinates for location ${JSON.stringify(location)}`
            );
            return null;
          }
        })}
        
        {/* <Modal visible={modalVisible}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Modal content goes here</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Close modal</Text>
            </TouchableOpacity>
          </View>
        </Modal> */}
      </MapView>
      <Modal visible={modalVisible} onRequestClose={handleModalClose}>
          <View style={styles.modalView}>
            {/* <Text>{location.name}</Text> */}
            {/* <TouchableOpacity > */}
              
              {/* <Text >{JSON.stringify(currentMarker)}</Text> */}
              <Text >Fajr: {(currentMarker['fajr'])}</Text>
              <Text >Zuhr: {(currentMarker['zohr'])}</Text>
              <Text >Asr: {(currentMarker['asr'])}</Text>
              <Text >Maghrib: {(currentMarker['maghrib'])}</Text>
              <Text >Isha: {(currentMarker['isha'])}</Text>
              <Text >Jummah: {(currentMarker['jumma'])}</Text>
              <Text >Area: {(currentMarker['area'])}</Text>
              {/* <Image source={('https://pk.top10place.com/img_files/147421088687399')}/> */}
              <Image source = {{uri:(currentMarker['url'])}}
   style = {{ width: 150, height: 150 }}
   /> 
              <Button title="close" onPress={handleModalClose}/>
              {/* <Text >{(currentMarker['url'])}</Text> */}
            {/* </TouchableOpacity> */}
          </View>
        </Modal>
      <Button title="Get Location" onPress={UserLocation} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  close:{
    width:80,
    height:80,
    // marginTop: 10,
  },
  modalView:{
    alignItems: "center",
    marginTop: 40,
    
  }
});
