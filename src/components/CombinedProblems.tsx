import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from '../utils/MathRenderer';
import './FactorizationExercises.css'; // Reutilizamos el mismo CSS
import { addCoinsToUser, getUserProfile } from '../firebase/userService';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { generateAIExercises } from '../firebase/apiConfig';
import axios from 'axios';

// Tipos de ejercicios
enum ExerciseType {
  PRODUCTOS_NOTABLES = 'productos_notables',
  FACTOREO = 'factoreo',
  FRACCIONES_ALGEBRAICAS = 'fracciones_algebraicas',
  TODOS = 'todos'
}

// Niveles de dificultad
enum DifficultyLevel {
  MEDIUM = 'Medio',
  HARD = 'Difícil'
}

// Interfaz para un ejercicio
interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  problem: string;
  solution: string;
  hint?: string;
  points: number;
}

// Interfaz para usuario
interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

// Función para generar un ID único
const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Componente principal de problemas combinados
interface CombinedProblemsProps {
  user?: User | null;
}

const CombinedProblems: React.FC<CombinedProblemsProps> = ({ user }) => {
  const [exerciseType, setExerciseType] = useState<ExerciseType>(ExerciseType.TODOS);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showLatexGuide, setShowLatexGuide] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [totalExercises, setTotalExercises] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  // Lista de IDs de ejercicios ya completados por el usuario
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  // Estado para controlar si se están usando ejercicios generados por IA
  const [useAI, setUseAI] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  // Cargar puntos del usuario y ejercicios completados al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.uid) {
        try {
          // Intentar obtener perfil de usuario
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserPoints(userData.totalCoins || 0);
            setTotalExercises(userData.exercisesCompleted || 0);
          }

          // Cargar los IDs de ejercicios completados desde localStorage
          const completedExercisesKey = `completed_exercises_${user.uid}`;
          const savedCompletedExercises = localStorage.getItem(completedExercisesKey);
          if (savedCompletedExercises) {
            setCompletedExercises(JSON.parse(savedCompletedExercises));
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          // En caso de error, almacenamos localmente
          const localPoints = localStorage.getItem(`coins_${user.uid}`);
          if (localPoints) {
            setUserPoints(Number(localPoints));
          }
        }
      }
    };
    
    loadUserData();
  }, [user]);

  // Verificar el estado de la API al cargar el componente
  useEffect(() => {
    // Verificar el estado de la API solo si no se ha verificado antes
    if (apiStatus === 'idle') {
      checkApiStatus();
    }
  }, []);

  // Ejercicios de productos notables
  const productosNotablesEjercicios: Exercise[] = [
    // Ejercicios de nivel medio (2 puntos)
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(2x + 3)^2",
      solution: "4x^2 + 12x + 9",
      hint: "Aplica la fórmula del cuadrado de un binomio: (a+b)² = a² + 2ab + b²",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(x - 4)^2",
      solution: "x^2 - 8x + 16",
      hint: "Aplica la fórmula del cuadrado de un binomio: (a-b)² = a² - 2ab + b²",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(3x + 2)(3x - 2)",
      solution: "9x^2 - 4",
      hint: "Aplica la fórmula del producto de binomios conjugados: (a+b)(a-b) = a² - b²",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(x + 5)(x - 2)",
      solution: "x^2 + 3x - 10",
      hint: "Aplica la distributividad: (a+b)(c+d) = ac + ad + bc + bd",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(2x - 1)^2",
      solution: "4x^2 - 4x + 1",
      hint: "Aplica la fórmula del cuadrado de un binomio",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "(x + 3)(x + 4)",
      solution: "x^2 + 7x + 12",
      hint: "Aplica la distributividad",
      points: 2
    },
    // Ejercicios de nivel difícil (3 puntos)
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.HARD,
      problem: "(2x - 3y)^2",
      solution: "4x^2 - 12xy + 9y^2",
      hint: "Aplica la fórmula del cuadrado de un binomio con dos variables",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.HARD,
      problem: "(x^2 + 3)(x^2 - 3)",
      solution: "x^4 - 9",
      hint: "Recuerda la fórmula del producto de binomios conjugados",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.HARD,
      problem: "(x + y)^3",
      solution: "x^3 + 3x^2y + 3xy^2 + y^3",
      hint: "Aplica la fórmula del cubo de un binomio",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.HARD,
      problem: "(2x - 1)^3",
      solution: "8x^3 - 12x^2 + 6x - 1",
      hint: "Aplica la fórmula del cubo de un binomio",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.PRODUCTOS_NOTABLES,
      difficulty: DifficultyLevel.HARD,
      problem: "(3x + 2)(2x^2 - 3x + 1)",
      solution: "6x^3 - 9x^2 + 3x + 4x^2 - 6x + 2",
      hint: "Aplica la distributividad de un binomio por un trinomio",
      points: 3
    }
  ];

  // Ejercicios de factoreo
  const factoreoEjercicios: Exercise[] = [
    // Ejercicios de nivel medio (2 puntos)
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "x^2 - 4x + 4",
      solution: "(x - 2)^2",
      hint: "Es un trinomio cuadrado perfecto",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "x^2 - 9",
      solution: "(x - 3)(x + 3)",
      hint: "Es una diferencia de cuadrados",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "2x^2 + 8x + 8",
      solution: "2(x^2 + 4x + 4)",
      hint: "Saca factor común y luego identifica si el trinomio es cuadrado perfecto",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "x^2 + 5x + 6",
      solution: "(x + 2)(x + 3)",
      hint: "Busca dos números que multiplicados den 6 y sumados den 5",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "x^2 - 7x + 12",
      solution: "(x - 3)(x - 4)",
      hint: "Busca dos números que multiplicados den 12 y sumados den -7",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "3x^2 + 12x",
      solution: "3x(x + 4)",
      hint: "Saca el factor común",
      points: 2
    },
    // Ejercicios de nivel difícil (3 puntos)
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.HARD,
      problem: "x^3 - 8",
      solution: "(x - 2)(x^2 + 2x + 4)",
      hint: "Es una diferencia de cubos: a³ - b³ = (a - b)(a² + ab + b²)",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.HARD,
      problem: "x^4 - 16",
      solution: "(x^2 - 4)(x^2 + 4)",
      hint: "Factoriza como diferencia de cuadrados, luego sigue factorizando",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.HARD,
      problem: "x^3 + 27",
      solution: "(x + 3)(x^2 - 3x + 9)",
      hint: "Es una suma de cubos: a³ + b³ = (a + b)(a² - ab + b²)",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.HARD,
      problem: "2x^3 - 54x",
      solution: "2x(x^2 - 27)",
      hint: "Saca factor común y luego identifica la diferencia de cuadrados",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FACTOREO,
      difficulty: DifficultyLevel.HARD,
      problem: "x^4 - 5x^2 + 6",
      solution: "(x^2 - 2)(x^2 - 3)",
      hint: "Trátalo como un trinomio cuadrático en x²",
      points: 3
    }
  ];

  // Ejercicios de fracciones algebraicas
  const fraccionesAlgebraicasEjercicios: Exercise[] = [
    // Ejercicios de nivel medio (2 puntos)
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{x^2-1}{x-1}",
      solution: "x+1",
      hint: "Factoriza el numerador como (x-1)(x+1)",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{1}{x+1} + \\frac{2}{x+2}",
      solution: "\\frac{3x+4}{(x+1)(x+2)}",
      hint: "Encuentra el denominador común",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
      solution: "\\frac{x}{x-1}",
      hint: "Cancela los factores comunes (x+1)",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{3}{x-2} - \\frac{1}{x+1}",
      solution: "\\frac{2x+5}{(x-2)(x+1)}",
      hint: "Encuentra el denominador común, resta las fracciones y simplifica al máximo",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{2x}{3} \\cdot \\frac{6}{x^2}",
      solution: "\\frac{4}{x}",
      hint: "Multiplica numeradores entre sí y denominadores entre sí, luego simplifica",
      points: 2
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.MEDIUM,
      problem: "\\frac{x^2-4}{x+2}",
      solution: "x-2",
      hint: "Factoriza el numerador y simplifica la fracción",
      points: 2
    },
    // Ejercicios de nivel difícil (3 puntos)
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.HARD,
      problem: "\\frac{x^2-25}{x^2-4} \\cdot \\frac{x-2}{x-5}",
      solution: "\\frac{x+5}{x+2}",
      hint: "Factoriza las diferencias de cuadrados y cancela factores comunes",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.HARD,
      problem: "\\frac{1}{x-1} + \\frac{1}{x+1} + \\frac{2}{x^2-1}",
      solution: "\\frac{2}{x-1}",
      hint: "Recuerda que x²-1 = (x-1)(x+1) y encuentra el denominador común. Luego simplifica al máximo.",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.HARD,
      problem: "\\frac{x^3-1}{x-1} \\div \\frac{x^2+x+1}{x+1}",
      solution: "x+1",
      hint: "Factoriza x³-1 como (x-1)(x²+x+1) y simplifica",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.HARD,
      problem: "\\frac{x^2-6x+9}{x^3-27} \\div \\frac{x-3}{x^2+3x+9}",
      solution: "1",
      hint: "Factoriza completamente y divide las fracciones",
      points: 3
    },
    {
      id: generateId(),
      type: ExerciseType.FRACCIONES_ALGEBRAICAS,
      difficulty: DifficultyLevel.HARD,
      problem: "\\frac{x^3-8}{x-2}",
      solution: "x^2+2x+4",
      hint: "Factoriza el numerador como (x-2)(x²+2x+4)",
      points: 3
    }
  ];

  // Función para generar variaciones de ejercicios
  const generateVariation = (exercise: Exercise): Exercise => {
    // Crear una copia del ejercicio
    const newExercise = { ...exercise, id: generateId() };
    
    // Dependiendo del tipo de ejercicio, modificar ligeramente los valores
    if (exercise.type === ExerciseType.PRODUCTOS_NOTABLES) {
      // Modificar coeficientes ligeramente para productos notables
      if (exercise.problem.includes('(x')) {
        // Reemplazar x con (x+1) o (x-1) para crear una variación
        const variation = Math.random() > 0.5 ? 1 : -1;
        newExercise.problem = exercise.problem.replace(/\(x/g, `(x${variation > 0 ? '+' : ''}${variation}`);
        
        // Ajustar la solución (esto es simplificado, en un caso real necesitarías recalcular la solución)
        // Para una implementación completa, necesitarías usar una biblioteca de álgebra simbólica
        newExercise.solution = "Solución recalculada"; // Placeholder
      }
    } else if (exercise.type === ExerciseType.FACTOREO) {
      // Para factorización, podemos cambiar los coeficientes
      if (exercise.problem.includes('x^2')) {
        const coefficient = Math.floor(Math.random() * 3) + 2; // 2, 3, o 4
        newExercise.problem = exercise.problem.replace(/(\d+)x\^2/, `${coefficient}x^2`);
        // Ajustar solución (placeholder)
        newExercise.solution = "Solución recalculada";
      }
    } else if (exercise.type === ExerciseType.FRACCIONES_ALGEBRAICAS) {
      // Para fracciones, podemos cambiar los términos constantes
      if (exercise.problem.includes('+')) {
        const variation = Math.floor(Math.random() * 3) + 1; // 1, 2, o 3
        newExercise.problem = exercise.problem.replace(/\+\s*(\d+)/g, `+${variation}`);
        // Ajustar solución (placeholder)
        newExercise.solution = "Solución recalculada";
      }
    }
    
    return newExercise;
  };

  // Generar un nuevo ejercicio
  const generateNewExercise = () => {
    let allExercises: Exercise[] = [];
    
    // Seleccionar ejercicios según el tipo
    if (exerciseType === ExerciseType.PRODUCTOS_NOTABLES) {
      allExercises = productosNotablesEjercicios;
    } else if (exerciseType === ExerciseType.FACTOREO) {
      allExercises = factoreoEjercicios;
    } else if (exerciseType === ExerciseType.FRACCIONES_ALGEBRAICAS) {
      allExercises = fraccionesAlgebraicasEjercicios;
    } else {
      // Si es "TODOS", combinar todos los ejercicios
      allExercises = [
        ...productosNotablesEjercicios,
        ...factoreoEjercicios,
        ...fraccionesAlgebraicasEjercicios
      ];
    }
    
    // Filtrar por dificultad
    let filteredExercises = allExercises.filter(ex => ex.difficulty === difficulty);
    
    // Filtrar ejercicios ya completados
    const availableExercises = filteredExercises.filter(ex => !completedExercises.includes(ex.id));
    
    // Si no hay ejercicios disponibles (todos han sido completados), generar variaciones
    if (availableExercises.length === 0) {
      console.log("Todos los ejercicios han sido completados, generando variaciones...");
      
      // Tomar ejercicios originales y generar variaciones
      const variations = filteredExercises.map(ex => generateVariation(ex));
      
      // Seleccionar un ejercicio aleatorio de las variaciones
      if (variations.length > 0) {
        const randomIndex = Math.floor(Math.random() * variations.length);
        setCurrentExercise(variations[randomIndex]);
        setUserAnswer('');
        setShowSolution(false);
        setIsCorrect(null);
        setError(null);
        return;
      }
      
      setError("No hay más ejercicios disponibles para esta categoría y dificultad.");
      setCurrentExercise(null);
      return;
    }
    
    // Seleccionar un ejercicio aleatorio de los disponibles
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    setCurrentExercise(availableExercises[randomIndex]);
    setUserAnswer('');
    setShowSolution(false);
    setIsCorrect(null);
    setError(null);
  };

  // Verificar el estado de la API
  const checkApiStatus = async (): Promise<boolean> => {
    setApiStatus('checking');
    try {
      // Intentar hacer una solicitud simple a la API para verificar si está disponible
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      const functionUrl = isLocalhost 
        ? 'http://localhost:5001/math-basis/us-central1/deepseekProxy' 
        : 'https://us-central1-math-basis.cloudfunctions.net/deepseekProxy';
      
      console.log('Verificando disponibilidad de API en:', functionUrl);
      
      // Primera verificación: Intento directo con axios
      try {
        const response = await axios.post(
          functionUrl,
          { 
            action: 'ping', 
            timestamp: Date.now() 
          },
          { 
            headers: { 
              'Content-Type': 'application/json',
              'X-Check-Type': 'availability-check'
            },
            timeout: 10000 // 10 segundos máximo para la verificación
          }
        );
        
        console.log('Respuesta de verificación recibida:', response.status);
        
        if (response.status === 200) {
          console.log('API disponible (método directo)');
          setApiStatus('available');
          return true;
        }
      } catch (httpError) {
        console.log('Error en verificación directa:', httpError);
        // Si falla el método directo, intentamos con el SDK de Firebase
      }
      
      // Segunda verificación: Usar el SDK de Firebase Functions
      try {
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const { functions } = await import('../firebase/firebaseConfig');
        
        const pingFunction = httpsCallable(functions, 'deepseekProxy');
        const result = await pingFunction({ action: 'ping', timestamp: Date.now() });
        
        console.log('Respuesta de verificación SDK recibida:', result);
        
        if (result.data) {
          console.log('API disponible (método SDK)');
          setApiStatus('available');
          return true;
        }
      } catch (sdkError) {
        console.log('Error en verificación SDK:', sdkError);
        // Si ambos métodos fallan, marcamos como no disponible
      }
      
      // Si llegamos aquí, la API no está disponible
      console.log('API no disponible después de verificación');
      setApiStatus('unavailable');
      return false;
      
    } catch (error) {
      console.error('Error al verificar el estado de la API:', error);
      setApiStatus('unavailable');
      return false;
    }
  };

  // Generar ejercicios usando IA
  const generateAIExercise = async () => {
    setIsGeneratingAI(true);
    setError(null);
    
    // Verificar primero el estado de la API si no se ha verificado
    if (apiStatus === 'idle') {
      const isApiAvailable = await checkApiStatus();
      if (!isApiAvailable) {
        setError("La API de DeepSeek no está disponible en este momento. Usando ejercicios predefinidos.");
        generateNewExercise();
        setIsGeneratingAI(false);
        return;
      }
    } else if (apiStatus === 'unavailable') {
      setError("La API de DeepSeek no está disponible. Usando ejercicios predefinidos.");
      generateNewExercise();
      setIsGeneratingAI(false);
      return;
    }
    
    try {
      console.log("🚀 Iniciando generación de ejercicio con IA");
      
      // Mapear el tipo de ejercicio a los tipos que acepta la API de DeepSeek
      let aiTopic: 'factorization' | 'rationalfractions';
      let aiType: string;
      
      if (exerciseType === ExerciseType.PRODUCTOS_NOTABLES) {
        aiTopic = 'factorization';
        aiType = 'productos_notables';
      } else if (exerciseType === ExerciseType.FACTOREO) {
        aiTopic = 'factorization';
        aiType = 'factoreo';
      } else if (exerciseType === ExerciseType.FRACCIONES_ALGEBRAICAS) {
        aiTopic = 'rationalfractions';
        aiType = 'fracciones_algebraicas';
      } else {
        // Si es TODOS, elegir aleatoriamente
        const randomType = Math.random();
        if (randomType < 0.33) {
          aiTopic = 'factorization';
          aiType = 'productos_notables';
        } else if (randomType < 0.66) {
          aiTopic = 'factorization';
          aiType = 'factoreo';
        } else {
          aiTopic = 'rationalfractions';
          aiType = 'fracciones_algebraicas';
        }
      }
      
      // Mapear la dificultad
      const aiDifficulty = difficulty === DifficultyLevel.MEDIUM ? 'medium' : 'hard';
      
      console.log(`📌 Llamando a API con: Tema=${aiTopic}, Dificultad=${aiDifficulty}, Tipo=${aiType}`);
      
      // Llamar a la API para generar ejercicios con un timeout de 30 segundos
      const apiPromise = generateAIExercises(aiTopic, aiDifficulty, aiType);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al llamar a la API después de 30 segundos')), 30000)
      );
      
      // Race entre la API y el timeout
      const aiExercises = await Promise.race([apiPromise, timeoutPromise]) as any[];
      
      console.log("📥 Respuesta recibida de la API:", aiExercises);
      
      if (aiExercises && aiExercises.length > 0) {
        console.log("✅ Ejercicios generados correctamente:", aiExercises[0]);
        
        // Convertir el ejercicio generado por la IA al formato que usa nuestro componente
        const aiExercise: Exercise = {
          id: generateId(),
          type: exerciseType,
          difficulty: difficulty,
          problem: aiExercises[0].problem,
          solution: aiExercises[0].solution,
          hint: aiExercises[0].hint || "Intenta aplicar las técnicas aprendidas",
          points: difficulty === DifficultyLevel.MEDIUM ? 2 : 3
        };
        
        // Establecer el ejercicio generado como el actual
        setCurrentExercise(aiExercise);
        setUserAnswer('');
        setShowSolution(false);
        setIsCorrect(null);
      } else {
        throw new Error("La API no devolvió ejercicios válidos");
      }
    } catch (error) {
      console.error("❌ Error generando ejercicio con IA:", error);
      setError(`Error al generar ejercicio con IA: ${error instanceof Error ? error.message : 'Error desconocido'}. Intenta con un ejercicio predefinido.`);
      // Si falla la generación con IA, usar un ejercicio predefinido
      generateNewExercise();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Verificar respuesta
  const checkAnswer = async () => {
    if (!currentExercise) return;

    // Normalizar respuestas removiendo espacios y convirtiendo a minúsculas
    let normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase();
    let normalizedSolution = currentExercise.solution.replace(/\s+/g, '').toLowerCase();
    
    // Reemplazar caracteres especiales por equivalentes
    normalizedUserAnswer = normalizedUserAnswer
      .replace(/\^(\d+)/g, '^$1') // Mantener exponentes
      .replace(/\*/g, '') // Remover asteriscos de multiplicación
      .replace(/sqrt/g, '√'); // Reemplazar sqrt por √
      
    normalizedSolution = normalizedSolution
      .replace(/\^(\d+)/g, '^$1')
      .replace(/\*/g, '')
      .replace(/sqrt/g, '√');
    
    // Verificar múltiples formas válidas de la solución cuando aplique
    let correct = normalizedUserAnswer === normalizedSolution;
    
    // Si no coincide, pero es una expresión factorizada, verificar formato alternativo
    if (!correct && normalizedSolution.includes('(') && normalizedSolution.includes(')')) {
      // Si la solución tiene factores (a+b)(c+d), también aceptamos (c+d)(a+b)
      const factors = normalizedSolution.match(/\([^()]+\)/g);
      if (factors && factors.length > 1) {
        // Crear permutaciones de los factores
        const permutations = [];
        for (let i = 0; i < factors.length; i++) {
          for (let j = i + 1; j < factors.length; j++) {
            const perm1 = normalizedSolution.replace(factors[i] + factors[j], factors[j] + factors[i]);
            permutations.push(perm1);
          }
        }
        // Verificar si la respuesta del usuario coincide con alguna permutación
        correct = permutations.some(perm => normalizedUserAnswer === perm);
      }
    }
    
    // Para fracciones, verificar si la respuesta es equivalente con o sin paréntesis
    if (!correct && (normalizedSolution.includes('/') || normalizedUserAnswer.includes('/'))) {
      try {
        // Caso especial para fracciones
        const solutionParts = normalizedSolution.split('/');
        const userParts = normalizedUserAnswer.split('/');
        
        if (solutionParts.length === 2 && userParts.length === 2) {
          // Limpiar paréntesis externos si existen
          const cleanNumeratorSolution = solutionParts[0].replace(/^\(|\)$/g, '');
          const cleanDenominatorSolution = solutionParts[1].replace(/^\(|\)$/g, '');
          const cleanNumeratorUser = userParts[0].replace(/^\(|\)$/g, '');
          const cleanDenominatorUser = userParts[1].replace(/^\(|\)$/g, '');
          
          // Verificar si los numeradores y denominadores coinciden después de limpiar paréntesis
          correct = cleanNumeratorSolution === cleanNumeratorUser && 
                  cleanDenominatorSolution === cleanDenominatorUser;
                  
          // Si aún no es correcto, verificar si es una forma simplificada
          if (!correct) {
            // Verificar fracciones algebraicas simplificadas
            // 1. Verificar si la respuesta del usuario es una forma simplificada válida
            
            // Caso específico: x^2-1 / x-1 = x+1
            if (normalizedSolution.includes('(x-1)(x+1)') && 
                normalizedSolution.includes('/') && 
                normalizedSolution.includes('x-1') &&
                normalizedUserAnswer === 'x+1') {
              correct = true;
            }
            
            // Caso específico: x^2-4 / x+2 = x-2
            else if (normalizedSolution.includes('(x-2)(x+2)') && 
                    normalizedSolution.includes('/') && 
                    normalizedSolution.includes('x+2') &&
                    normalizedUserAnswer === 'x-2') {
              correct = true;
            }
            
            // Caso específico: x^3-8 / x-2 = x^2+2x+4
            else if (normalizedSolution.includes('(x-2)(x^2+2x+4)') && 
                    normalizedSolution.includes('/') && 
                    normalizedSolution.includes('x-2') &&
                    normalizedUserAnswer === 'x^2+2x+4') {
              correct = true;
            }
            
            // Caso específico para el ejercicio 1/(x-1) + 1/(x+1) + 2/(x^2-1)
            // Cuya solución es (2x+2)/((x-1)(x+1)) o en su forma más simplificada 2/(x-1)
            else if (currentExercise.problem === "\\frac{1}{x-1} + \\frac{1}{x+1} + \\frac{2}{x^2-1}" && 
                    (normalizedUserAnswer === "2/(x-1)" || 
                     normalizedUserAnswer === "2/x-1" || 
                     normalizedUserAnswer === "2/(x-1)")) {
              correct = true;
            }
            
            // Caso general para fracciones algebraicas
            // Si la respuesta esperada tiene forma (numerador)/(denominador) pero el usuario
            // dio una forma simplificada, intentamos validarla
            else if (currentExercise.type === ExerciseType.FRACCIONES_ALGEBRAICAS) {
              // Verificar si la respuesta del usuario podría ser una simplificación válida
              // Esto requeriría un análisis más complejo de expresiones algebraicas
              
              // Caso específico para 3/(x-2) - 1/(x+1)
              if (currentExercise.problem === "\\frac{3}{x-2} - \\frac{1}{x+1}" && 
                  (normalizedUserAnswer === "(2x+5)/((x-2)(x+1))" || 
                   normalizedUserAnswer === "\\frac{2x+5}{(x-2)(x+1)}" ||
                   normalizedUserAnswer === "(2x+5)/((x-2)(x+1))" ||
                   normalizedUserAnswer === "(2x+5)/(x-2)(x+1)")) {
                correct = true;
              }
              
              // Verificar otras simplificaciones comunes
              // Por ejemplo, si la respuesta esperada es (x^2-4)/(x+2) = (x-2)(x+2)/(x+2) = x-2
              else if (cleanNumeratorSolution.includes(cleanDenominatorSolution) && 
                      normalizedUserAnswer === cleanNumeratorSolution.replace(cleanDenominatorSolution, '').replace(/^\*|\*$/g, '')) {
                correct = true;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar fracciones:", error);
      }
    }
    
    setIsCorrect(correct);
    
    // Si es correcto y hay un usuario, actualizar puntos
    if (correct && user?.uid && currentExercise) {
      try {
        // Actualizar monedas en Firebase
        const result = await addCoinsToUser(user.uid, currentExercise.points);
        if (result) {
          setUserPoints(result.totalCoins);
          setTotalExercises(result.exercisesCompleted);
        }
        
        // Guardar el ID del ejercicio completado en localStorage
        const updatedCompletedExercises = [...completedExercises, currentExercise.id];
        setCompletedExercises(updatedCompletedExercises);
        
        const completedExercisesKey = `completed_exercises_${user.uid}`;
        localStorage.setItem(completedExercisesKey, JSON.stringify(updatedCompletedExercises));
      } catch (error) {
        console.error("Error updating coins:", error);
        // En caso de error, almacenar localmente
        const currentCoins = Number(localStorage.getItem(`coins_${user.uid}`)) || 0;
        const newCoins = currentCoins + currentExercise.points;
        localStorage.setItem(`coins_${user.uid}`, newCoins.toString());
        setUserPoints(newCoins);
      }
    }
  };

  // Revelar solución
  const revealSolution = () => {
    setShowSolution(true);
  };

  // Siguiente ejercicio
  const nextExercise = () => {
    generateNewExercise();
  };

  // Componente para la guía de LaTeX
  const LatexGuide = () => (
    <div className="latex-guide">
      <h4>Guía para escribir respuestas</h4>
      <ul>
        <li>Exponentes: <code>x^2</code> para x²</li>
        <li>Fracciones: <code>(x+1)/(x-1)</code> para (x+1)/(x-1)</li>
        <li><strong>IMPORTANTE:</strong> En fracciones, usa paréntesis para el numerador y denominador cuando contengan sumas o restas</li>
        <li>Raíz cuadrada: <code>\sqrt{'{'}x{'}'}</code> para √x</li>
        <li>Productos: <code>2x</code> o <code>2*x</code> para 2x</li>
        <li>Paréntesis: Use <code>(</code> y <code>)</code> para agrupar expresiones</li>
        <li>No es necesario escribir el coeficiente 1, por ejemplo: <code>x</code> en lugar de <code>1x</code></li>
        <li><strong>OBJETIVO PRINCIPAL:</strong> Siempre debes proporcionar la respuesta en su forma MÁS SIMPLIFICADA posible</li>
        <li><strong>NOTA:</strong> Para fracciones algebraicas, se prefiere la forma más simplificada. Por ejemplo:
          <ul>
            <li><code>x^2-1</code> dividido por <code>x-1</code> debe simplificarse a <code>x+1</code></li>
            <li><code>x^2-4</code> dividido por <code>x+2</code> debe simplificarse a <code>x-2</code></li>
            <li>Si puedes cancelar factores comunes en el numerador y denominador, debes hacerlo</li>
          </ul>
        </li>
      </ul>
      <div className="important-note">
        <p><strong>IMPORTANTE:</strong> El sistema evaluará como correcta la respuesta más simplificada posible. Si tu respuesta es matemáticamente correcta pero no está en su forma más simple, podría ser marcada como incorrecta.</p>
      </div>
    </div>
  );

  // Renderizar ejercicio actual
  const renderCurrentExercise = () => {
    if (!currentExercise) {
      return (
        <div className="factorization-exercises-empty">
          <p>No hay ejercicios activos. Genera uno nuevo utilizando las opciones anteriores.</p>
          <div className="buttons-container">
            <button className="generate-button" onClick={generateNewExercise}>
              Generar ejercicio predefinido
            </button>
            <button 
              className="generate-ai-button" 
              onClick={generateAIExercise}
              disabled={isGeneratingAI || apiStatus === 'checking'}
            >
              {isGeneratingAI ? 'Generando con IA...' : 
               apiStatus === 'checking' ? 'Verificando API...' :
               apiStatus === 'unavailable' ? 'IA no disponible' : 'Generar con IA'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="exercise-container">
        <div className="exercise-header">
          <div className="exercise-type">{getExerciseTypeName(currentExercise.type)}</div>
          <div className="exercise-difficulty">{currentExercise.difficulty}</div>
          <div className="exercise-points">Valor: {currentExercise.points} {currentExercise.points === 1 ? 'moneda' : 'monedas'}</div>
        </div>

        <div className="exercise-problem">
          <h3>Resuelve la siguiente expresión:</h3>
          <div className="problem-display">
            <BlockMath math={currentExercise.problem} />
          </div>
        </div>

        {currentExercise.hint && !showSolution && isCorrect === false && (
          <div className="exercise-hint">
            <strong>Pista:</strong> {currentExercise.hint}
          </div>
        )}

        {isCorrect === true && (
          <div className="correct-feedback">
            ¡Correcto! Has ganado {currentExercise.points} {currentExercise.points === 1 ? 'moneda' : 'monedas'}.
          </div>
        )}

        {showSolution && (
          <div className="solution-display">
            <h4>Solución:</h4>
            <BlockMath math={currentExercise.solution} />
          </div>
        )}

        <div className="answer-section">
          <label htmlFor="user-answer">Tu respuesta:</label>
          <div className="input-container">
            <input
              id="user-answer"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={
                isCorrect === null 
                  ? '' 
                  : isCorrect 
                    ? 'correct-answer' 
                    : 'incorrect-answer'
              }
              disabled={isCorrect === true || showSolution}
              placeholder="Escribe tu respuesta aquí..."
            />
            <button 
              className="latex-guide-button" 
              type="button" 
              onClick={() => setShowLatexGuide(!showLatexGuide)}
              title="Mostrar/ocultar guía de escritura"
            >
              ?
            </button>
          </div>

          {showLatexGuide && <LatexGuide />}

          <div className="action-buttons">
            <button 
              className="check-button" 
              onClick={checkAnswer}
              disabled={userAnswer.trim() === '' || isCorrect === true || showSolution}
            >
              Verificar
            </button>
            <button 
              className="solution-button" 
              onClick={revealSolution}
              disabled={isCorrect === true || showSolution}
            >
              Ver solución
            </button>
            <button 
              className="next-button" 
              onClick={nextExercise}
            >
              Siguiente ejercicio
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Convertir tipo de ejercicio a nombre legible
  const getExerciseTypeName = (type: ExerciseType): string => {
    switch (type) {
      case ExerciseType.PRODUCTOS_NOTABLES:
        return 'Productos Notables';
      case ExerciseType.FACTOREO:
        return 'Factorización';
      case ExerciseType.FRACCIONES_ALGEBRAICAS:
        return 'Fracciones Algebraicas';
      case ExerciseType.TODOS:
        return 'Todos los tipos';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="factorization-exercises-container">
      <h2 className="factorization-exercises-title">Problemas Combinados</h2>
      
      {user && (
        <div className="user-stats">
          <div className="user-points">
            <span className="stats-label">Monedas:</span> 
            <span className="stats-value">{userPoints}</span>
          </div>
          <div className="user-exercises">
            <span className="stats-label">Ejercicios completados:</span> 
            <span className="stats-value">{totalExercises}</span>
          </div>
        </div>
      )}
      
      <div className="exercise-filters">
        <div className="filter-group">
          <label htmlFor="exercise-type">Tipo de ejercicio:</label>
          <select
            id="exercise-type"
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
          >
            <option value={ExerciseType.TODOS}>Todos los tipos</option>
            <option value={ExerciseType.PRODUCTOS_NOTABLES}>Productos Notables</option>
            <option value={ExerciseType.FACTOREO}>Factorización</option>
            <option value={ExerciseType.FRACCIONES_ALGEBRAICAS}>Fracciones Algebraicas</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          >
            <option value={DifficultyLevel.MEDIUM}>Medio (2 monedas)</option>
            <option value={DifficultyLevel.HARD}>Difícil (3 monedas)</option>
          </select>
        </div>
        
        <div className="buttons-container">
          <button 
            className="generate-button" 
            onClick={generateNewExercise}
            disabled={isGeneratingAI}
          >
            Generar ejercicio predefinido
          </button>
          
          <button 
            className="generate-ai-button" 
            onClick={generateAIExercise}
            disabled={isGeneratingAI || apiStatus === 'checking'}
          >
            {isGeneratingAI ? 'Generando con IA...' : 
             apiStatus === 'checking' ? 'Verificando API...' :
             apiStatus === 'unavailable' ? 'IA no disponible' : 'Generar con IA'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {renderCurrentExercise()}
    </div>
  );
};

export default CombinedProblems; 