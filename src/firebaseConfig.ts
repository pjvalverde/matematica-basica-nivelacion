import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1n5o_u8cR0Yp1C8-JBXc5LJ-jnMDl9G8",
  authDomain: "math-basis.firebaseapp.com",
  projectId: "math-basis",
  storageBucket: "math-basis.appspot.com",
  messagingSenderId: "246621878246",
  appId: "1:246621878246:web:3cb1cb1bbdeaa5d5aa69c2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };