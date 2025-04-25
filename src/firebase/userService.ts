import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Interfaz para almacenar el perfil del usuario
interface UserProfile {
  email: string;
  displayName?: string;
  totalPoints: number;
  exercisesCompleted: number;
  created: Date;
  lastActive: Date;
}

// Función para inicializar un perfil de usuario
export const initUserProfile = async (userId: string, email: string, displayName?: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Si el usuario no existe, creamos su perfil
    const userData: UserProfile = {
      email,
      displayName,
      totalPoints: 0,
      exercisesCompleted: 0,
      created: new Date(),
      lastActive: new Date()
    };
    
    await setDoc(userRef, userData);
    return userData;
  } else {
    // Si el usuario ya existe, actualizamos lastActive
    await updateDoc(userRef, {
      lastActive: new Date()
    });
    return userSnap.data() as UserProfile;
  }
};

// Función para añadir puntos al usuario
export const addPointsToUser = async (userId: string, points: number) => {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    totalPoints: increment(points),
    exercisesCompleted: increment(1),
    lastActive: new Date()
  });
  
  // Devolver los puntos actualizados
  const updatedSnap = await getDoc(userRef);
  if (updatedSnap.exists()) {
    return updatedSnap.data() as UserProfile;
  }
  return null;
};

// Función para obtener los puntos totales del usuario
export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}; 