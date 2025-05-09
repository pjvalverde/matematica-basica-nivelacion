import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Configuración real de Firebase para este proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDkFaKhmgMitvCUcBSL58_IN3Y05Ry1aac",
  authDomain: "math-basis.firebaseapp.com",
  projectId: "math-basis",
  storageBucket: "math-basis.firebasestorage.app",
  appId: "1:1025897336301:web:48d29d5501b152e98b6be4",
  measurementId: "G-HL8GZ5NCG3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions }; 