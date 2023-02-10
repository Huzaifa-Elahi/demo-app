import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth'
import firebase from 'firebase/app';
import 'firebase/firestore';


// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDHFEmulR4RCEdmyIgXVohUScGB0cKd62U",
  authDomain: "masjiddigitalization.firebaseapp.com",
  projectId: "masjiddigitalization",
  storageBucket: "masjiddigitalization.appspot.com",
  messagingSenderId: "73896570090",
  appId: "1:73896570090:web:fa3c74697ed3700628bb93",
  measurementId: "G-MRJ3KWMPMW"
};
const app = initializeApp(firebaseConfig);

// const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export const auth=getAuth(app);

export const firestore = firebase.firestore();
// r
