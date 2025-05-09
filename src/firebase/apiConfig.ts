// Configuración para la API de DeepSeek
// La clave API se almacena de forma segura en Firebase Functions
// y no se expone directamente en el código cliente

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';

// Inicializa Firebase Functions
const functions = getFunctions(app);

// Función para generar ejercicios usando DeepSeek AI a través de Firebase Functions
export const generateAIExercises = async (
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
) => {
  try {
    // Esta función llamará a una Cloud Function de Firebase que contendrá la API key
    // y realizará la petición a DeepSeek
    const generateExercisesFunction = httpsCallable(functions, 'generateExercises');
    
    const result = await generateExercisesFunction({
      topic,
      difficulty,
      type
    });
    
    return result.data;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
}; 