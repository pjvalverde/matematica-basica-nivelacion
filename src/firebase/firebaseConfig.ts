import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// IMPORTANTE: Reemplaza esta configuración con los datos de tu proyecto Firebase
// Puedes encontrar esta información en la consola de Firebase:
// 1. Ve a https://console.firebase.google.com
// 2. Selecciona tu proyecto
// 3. Haz clic en "Configuración del proyecto" (icono de engranaje)
// 4. En la pestaña "General", desplázate hacia abajo hasta "Tus apps" y copia los detalles
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 