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

// import './styles.css';

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
  const [currentMarker, setcurrentMarker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalClose = () => {
    setModalVisible(false);
    console.log("closed");
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
  const handleMarkerPress = (location) => {
    setModalVisible(true), setcurrentMarker(location);
  };

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
                onPress={
                  () => handleMarkerPress(location)
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
      <Modal
        visible={modalVisible}
        onRequestClose={handleModalClose}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalView}>
          {/* <Text>{location.name}</Text> */}
          {/* <TouchableOpacity > */}

          {/* <Text >{JSON.stringify(currentMarker)}</Text> */}
          <Text style={styles.masjidName}>{currentMarker["name"]}</Text>
          <Text className="same"  style={{  justifyContent: "center", alignItems: "center", marginBottom:5, }} >
            <Text  style={styles.area}>
            {currentMarker["area"]}
            </Text>
            
          </Text>
          <Image
            source={{ uri: currentMarker["url"] }}
            style={{ width: 150, height: 150 }}
          />
          
          {/* <Text className="same" style={styles.fajr}>Fajr: {(currentMarker['fajr'])}</Text> */}
          <Text style={styles.fajr}>
            Fajr         : <Text style={styles.fajrValue}>{currentMarker["fajr"]}</Text>
          </Text>
          <Text style={styles.zuhr}>
            Zuhr        : <Text style={styles.zuhrValue}>{currentMarker["zohr"]}</Text>
          </Text>
          <Text style={styles.asr}>
            Asr          : <Text style={styles.asrValue}>{currentMarker["asr"]}</Text>
          </Text>
          <Text style={styles.maghrib}>
            Maghrib : <Text style={styles.maghribValue}>{currentMarker["maghrib"]}</Text>
          </Text>
          <Text style={styles.isha}>
            Isha         : <Text style={styles.ishaValue}>{currentMarker["isha"]}</Text>
          </Text>
          <Text style={styles.jummah}>
            Jummah : <Text style={styles.jummahValue}>{currentMarker["jumma"]}</Text>
          </Text>
          {/* <Text className="same" style={styles.zuhr}>
            Zuhr: {currentMarker["zohr"]}
          </Text>
          <Text className="same" style={styles.asr}>
            Asr: {currentMarker["asr"]}
          </Text>
          <Text className="same" style={styles.maghrib}>
            Maghrib: {currentMarker["maghrib"]}
          </Text>
          <Text className="same" style={styles.isha}>
            Isha: {currentMarker["isha"]}
          </Text>
          <Text className="same" style={styles.jummah}>
            Jummah: {currentMarker["jumma"]}
          </Text> */}
        
          {/* <Image source={('https://pk.top10place.com/img_files/147421088687399')}/> */}

          <Button
            style={{color:"black"}}
            title="close"
            onPress={handleModalClose}
          />
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
  close: {
    width: "80%",
    backgroundColor: "#39d5a2",
    fontSize: 50,
    // height:80,
    // top:40,
    // height:'50%',
    // marginTop: 10,
  },
  modalView: {
    alignItems: "center",
    marginTop: 40,
    top: "43%",
    height: "60%",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    borderRadius: 30,
    backgroundColor: "#39d5a2",
    backgroundImage:
      "linear-gradient(0deg, #206d53 0%, #2AF598 50%, #53e46c 100%)",
  },
  masjidName: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    borderRadius: 10,
    marginBottom:10,
    // width:100,
  },
  fajr: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
    marginTop:10,
    width: "38%",
    paddingLeft: 25,
  },
  zuhr: {
    marginTop:5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

    width: "38%",
    paddingLeft: 25,
  },
  asr: {
    marginTop:5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

    width: "38%",
    paddingLeft: 25,
  },
  maghrib: {
    marginTop:5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

    width: "38%",
    paddingLeft: 25,
  },
  isha: {
    marginTop:5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

    width: "38%",
    paddingLeft: 25,
  },
  jummah: {
    marginTop:5,
    marginBottom:5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",

    width: "38%",
    paddingLeft: 25,
  },
  area: {
    // marginTop:15,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    backgroundColor: "black",
    borderRadius:100,
    borderWidth: 1,
    borderColor: "darkgreen",
    borderStyle: "solid",

    width: "100%",
    alignText: "center",
    // paddingLeft: 105,
  },
  
  fajrValue: {
    // marginTop:5,
    color: 'black',
    // fontStyle: 'italic',
    // margin: '45%',
    fontWeight:"bold",
    width:200,
    borderWidth: 1,
    borderColor: "pink",
    borderStyle: "solid",
    // backgroundColor: "#6DF58A",
    borderRadius: 30,

  },
  zuhrValue: {
    // marginTop:5,
    color: 'black',
    // fontStyle: 'italic',
    // margin: '45%',
    width:200,
    borderWidth: 10,
    borderColor: "pink",
    borderStyle: "solid",
    // backgroundColor: "#6DF58A",
    borderRadius: 30,
    // fontFamily:'Roboto',
  }
});
