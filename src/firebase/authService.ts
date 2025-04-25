import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { initUserProfile } from './userService';

// Registro de usuario nuevo
export const registerUser = async (email: string, password: string, displayName?: string) => {
  try {
    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Inicializar el perfil del usuario en Firestore
    await initUserProfile(user.uid, email, displayName);
    
    return user;
  } catch (error: any) {
    // Manejar errores específicos de Firebase Auth
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este correo electrónico ya está en uso.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    } else {
      throw new Error('Error al crear la cuenta: ' + error.message);
    }
  }
};

// Inicio de sesión
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar la última vez que el usuario inició sesión
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } else {
      // Si por alguna razón el usuario no tiene perfil, lo inicializamos
      await initUserProfile(user.uid, email, user.displayName || undefined);
    }
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Correo electrónico o contraseña incorrectos.');
    } else {
      throw new Error('Error al iniciar sesión: ' + error.message);
    }
  }
};

// Cierre de sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error: any) {
    throw new Error('Error al cerrar sesión: ' + error.message);
  }
};

// Obtener el usuario actual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Observador del estado de autenticación
export const onUserChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 