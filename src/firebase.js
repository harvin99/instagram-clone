import firebase from 'firebase'


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCmOgzwCEjJ_gcgotsAZ_g5FlNi0kirw1o",
    authDomain: "instagram-clone-react-fa4d8.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-fa4d8.firebaseio.com",
    projectId: "instagram-clone-react-fa4d8",
    storageBucket: "instagram-clone-react-fa4d8.appspot.com",
    messagingSenderId: "881210489617",
    appId: "1:881210489617:web:97c2da8c9aa0f2bef5eab0",
    measurementId: "G-C4337YCLGG"
  });

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export {db , auth, storage}
