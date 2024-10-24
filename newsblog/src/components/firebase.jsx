
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDxXbRGD6mvgUl8v2wIj8XUnoXmP1ncLdY",
  authDomain: "newsblog-87fee.firebaseapp.com",
  projectId: "newsblog-87fee",
  storageBucket: "newsblog-87fee.appspot.com",
  messagingSenderId: "173601145767",
  appId: "1:173601145767:web:fc2c14955e55d734856c82",
  measurementId: "G-1180QC8PMQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth =getAuth()
export const db = getFirestore(app)
export default app;