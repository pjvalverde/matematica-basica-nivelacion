import { doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Interfaz para almacenar el perfil del usuario
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  totalCoins: number;
  exercisesCompleted: number;
  created: Date;
  lastActive: Date;
  lastLogin?: Date;
  rank?: number; // Posición en el ranking
}

// Función para inicializar un perfil de usuario
export const initUserProfile = async (userId: string, email: string, displayName?: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Si el usuario no existe, creamos su perfil
    const userData: Omit<UserProfile, 'uid'> = {
      email,
      displayName,
      totalCoins: 0,
      exercisesCompleted: 0,
      created: new Date(),
      lastActive: new Date(),
      lastLogin: new Date()
    };
    
    await setDoc(userRef, userData);
    return { uid: userId, ...userData } as UserProfile;
  } else {
    // Si el usuario ya existe, actualizamos lastActive
    await updateDoc(userRef, {
      lastActive: new Date()
    });
    const userData = userSnap.data();
    return { uid: userId, ...userData } as UserProfile;
  }
};

// Función para añadir monedas al usuario
export const addCoinsToUser = async (userId: string, coins: number) => {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    totalCoins: increment(coins),
    exercisesCompleted: increment(1),
    lastActive: serverTimestamp()
  });
  
  // Devolver los datos actualizados
  const updatedSnap = await getDoc(userRef);
  if (updatedSnap.exists()) {
    const userData = updatedSnap.data();
    return { uid: userId, ...userData } as UserProfile;
  }
  return null;
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data();
    // Obtener también la posición en el ranking
    const rank = await getUserRank(userId);
    return { uid: userId, ...userData, rank } as UserProfile;
  }
  return null;
};

// Función para obtener el top de usuarios por monedas (leaderboard)
export const getTopUsers = async (limit_count: number = 10) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalCoins', 'desc'), limit(limit_count));
  
  const querySnapshot = await getDocs(q);
  const users: UserProfile[] = [];
  
  let rank = 1;
  querySnapshot.forEach((doc) => {
    users.push({
      uid: doc.id,
      ...doc.data(),
      rank
    } as UserProfile);
    rank++;
  });
  
  return users;
};

// Función para obtener la posición de un usuario en el ranking general
export const getUserRank = async (userId: string) => {
  // Obtener todos los usuarios ordenados por monedas en orden descendente
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('totalCoins', 'desc'));
  const querySnapshot = await getDocs(q);
  
  let rank = 0;
  let currentRank = 1;
  let lastCoins = -1;
  
  for (const doc of querySnapshot.docs) {
    const userData = doc.data();
    
    // Si las monedas son diferentes del último usuario, actualizar el rango
    // Esto maneja empates correctamente (mismas monedas = mismo rango)
    if (userData.totalCoins !== lastCoins) {
      lastCoins = userData.totalCoins;
      rank = currentRank;
    }
    
    // Si encontramos al usuario, devolver su rango
    if (doc.id === userId) {
      return rank;
    }
    
    currentRank++;
  }
  
  // Si no se encuentra al usuario
  return null;
}; 