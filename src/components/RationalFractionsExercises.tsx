import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from '../utils/MathRenderer';
import './FactorizationExercises.css'; // Reusing the same CSS
import { addCoinsToUser, getUserProfile } from '../firebase/userService';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AIExerciseGenerator from './AIExerciseGenerator';

// Tipos de ejercicios
enum ExerciseType {
  BASIC = 'basic',
  SIMPLIFICATION = 'simplification',
  ADDITION_SUBTRACTION = 'addition_subtraction',
  MULTIPLICATION_DIVISION = 'multiplication_division',
  COMPLEX_OPERATIONS = 'complex_operations',
  BUSINESS_APPLICATION = 'business_application'
}

// Niveles de dificultad
enum DifficultyLevel {
  EASY = 'Fácil',
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
  context?: string;
  hint?: string;
  points: number;
  displayType?: string;
  displayDifficulty?: string;
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

// Generador de ejercicios basado en el tipo y dificultad
const generateExercise = (type: ExerciseType, difficulty: DifficultyLevel): Exercise => {
  const id = generateId();
  
  let exercise: Exercise = {
    id,
    type,
    difficulty,
    problem: '',
    solution: '',
    points: 0
  };

  // Asignar puntos según la dificultad
  switch (difficulty) {
    case DifficultyLevel.EASY:
      exercise.points = 1;
      break;
    case DifficultyLevel.MEDIUM:
      exercise.points = 2;
      break;
    case DifficultyLevel.HARD:
      exercise.points = 3;
      break;
  }

  // Generar ejercicio según el tipo
  switch (type) {
    case ExerciseType.BASIC:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        exercise.problem = `\\frac{${a}x}{${b}}`;
        exercise.solution = `\\frac{${a}}{${b}}x`;
        exercise.hint = `Recuerda que puedes simplificar sacando el factor común.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        exercise.problem = `\\frac{${a}x^2 + ${a*b}x}{${b}}`;
        exercise.solution = `\\frac{${a}x(x + ${b})}{${b}} = ${a}x + \\frac{${a}x}{1}`;
        exercise.hint = `Busca el factor común en el numerador y luego simplifica.`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}x^2 + ${a*b}x + ${a*c}}{${b*c}}`;
        exercise.solution = `\\frac{${a}(x^2 + ${b}x + ${c})}{${b*c}} = \\frac{${a}}{${b*c}}(x^2 + ${b}x + ${c})`;
        exercise.hint = `Factoriza el numerador y luego simplifica con el denominador si es posible.`;
      }
      break;

    case ExerciseType.SIMPLIFICATION:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}x}{${a}}`;
        exercise.solution = `x`;
        exercise.hint = `Simplifica dividiendo numerador y denominador por ${a}.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}x - ${a*b}}{${a}}`;
        exercise.solution = `x - ${b}`;
        exercise.hint = `Factoriza el numerador para identificar factores comunes con el denominador.`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{x^2 - ${(a+b)**2}}{x + ${a+b}}`;
        exercise.solution = `x - ${a+b}`;
        exercise.hint = `Recuerda que la diferencia de cuadrados es (x-y)(x+y). Factoriza el numerador.`;
      }
      break;

    case ExerciseType.ADDITION_SUBTRACTION:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}}{x} + \\frac{${b}}{x}`;
        exercise.solution = `\\frac{${a+b}}{x}`;
        exercise.hint = `Suma fracciones con el mismo denominador sumando los numeradores.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}}{x} + \\frac{${b}}{${c}x}`;
        exercise.solution = `\\frac{${a*c} + ${b}}{${c}x} = \\frac{${a*c+b}}{${c}x}`;
        exercise.hint = `Encuentra el mínimo común múltiplo de los denominadores.`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}}{x-${b}} - \\frac{${c}}{x+${b}}`;
        exercise.solution = `\\frac{${a}(x+${b}) - ${c}(x-${b})}{(x-${b})(x+${b})} = \\frac{${a}x + ${a*b} - ${c}x + ${c*b}}{x^2 - ${b*b}} = \\frac{${a-c}x + ${a*b+c*b}}{x^2 - ${b*b}}`;
        exercise.hint = `Encuentra el mínimo común múltiplo y recuerda que (x-a)(x+a) = x² - a².`;
      }
      break;

    case ExerciseType.MULTIPLICATION_DIVISION:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}x}{${b}} \\cdot \\frac{${b}}{${a}}`;
        exercise.solution = `x`;
        exercise.hint = `Multiplica las fracciones y simplifica.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{${a}x+${b}}{${c}} \\div \\frac{${a}}{${c}}`;
        exercise.solution = `\\frac{${a}x+${b}}{${c}} \\cdot \\frac{${c}}{${a}} = \\frac{${a}x+${b}}{${a}} = x + \\frac{${b}}{${a}}`;
        exercise.hint = `Para dividir fracciones, multiplica por el recíproco de la segunda fracción.`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `\\frac{x^2-${a*a}}{x-${a}} \\cdot \\frac{x+${b}}{x^2-${b*b}}`;
        exercise.solution = `\\frac{(x-${a})(x+${a})}{x-${a}} \\cdot \\frac{x+${b}}{(x-${b})(x+${b})} = \\frac{x+${a}}{x-${b}}`;
        exercise.hint = `Factoriza los numeradores y denominadores, luego simplifica los factores comunes.`;
      }
      break;

    case ExerciseType.COMPLEX_OPERATIONS:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 2;
        exercise.problem = `\\frac{1}{x} + \\frac{1}{x+${a}} + \\frac{1}{x+${a+b}}`;
        exercise.solution = `\\frac{(x+${a})(x+${a+b}) + x(x+${a+b}) + x(x+${a})}{x(x+${a})(x+${a+b})}`;
        exercise.hint = `Encuentra el mínimo común múltiplo de los denominadores.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        exercise.problem = `\\frac{${a}}{x-1} - \\frac{${b}}{x+1} + \\frac{${a+b}}{x^2-1}`;
        exercise.solution = `\\frac{${a}(x+1) - ${b}(x-1) + ${a+b}}{(x-1)(x+1)} = \\frac{${a}x + ${a} - ${b}x + ${b} + ${a+b}}{x^2 - 1} = \\frac{${a-b}x + ${a+b+a+b}}{x^2 - 1}`;
        exercise.hint = `Recuerda que x²-1 = (x-1)(x+1) y busca el denominador común.`;
      } else {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        exercise.problem = `\\frac{x}{x^2-${a*a}} - \\frac{1}{x-${a}} + \\frac{1}{x+${a}}`;
        exercise.solution = `\\frac{x}{(x-${a})(x+${a})} - \\frac{1}{x-${a}} + \\frac{1}{x+${a}} = \\frac{x - (x+${a}) + (x-${a})}{(x-${a})(x+${a})} = \\frac{x - 2${a}}{(x-${a})(x+${a})}`;
        exercise.hint = `Factoriza el denominador x²-${a*a} = (x-${a})(x+${a}) y encuentra el denominador común.`;
      }
      break;

    case ExerciseType.BUSINESS_APPLICATION:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 100) + 50;
        const b = Math.floor(Math.random() * 50) + 10;
        exercise.problem = `\\frac{${a}x}{x+${b}}`;
        exercise.solution = `\\frac{${a}x}{x+${b}}`;
        exercise.context = `Una empresa tiene ingresos de ${a}x donde x es el número de unidades vendidas, y costos fijos de ${b} unidades monetarias. La función de utilidad por unidad es ${a} - \\frac{${b}}{x+${b}}. Simplifica la expresión de utilidad por unidad.`;
        exercise.hint = `Recuerda que la utilidad por unidad es (ingresos)/(unidades vendidas + costos fijos).`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const p = Math.floor(Math.random() * 50) + 50;
        const c = Math.floor(Math.random() * 20) + 10;
        const f = Math.floor(Math.random() * 500) + 100;
        exercise.problem = `\\frac{${p}x - ${c}x - ${f}}{x}`;
        exercise.solution = `${p} - ${c} - \\frac{${f}}{x}`;
        exercise.context = `Una empresa vende un producto a $${p} por unidad, con un costo variable de $${c} por unidad y costos fijos de $${f}. La ganancia total es (${p}x - ${c}x - ${f}). Simplifica la expresión para la ganancia por unidad.`;
        exercise.hint = `Divida cada término del numerador por el denominador.`;
      } else {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 100) + 100;
        exercise.problem = `\\frac{${a}x^2}{${b}x + ${c}}`;
        exercise.solution = `\\frac{${a}x^2}{${b}x + ${c}}`;
        exercise.context = `Un analista financiero ha determinado que el retorno de inversión (ROI) de un proyecto sigue la fórmula \\frac{${a}x^2}{${b}x + ${c}}, donde x representa miles de dólares invertidos. Expresa esta fórmula como la razón de dos polinomios.`;
        exercise.hint = `Esta expresión ya está en su forma más simple como la razón de dos polinomios.`;
      }
      break;
  }

  return exercise;
};

// Componente principal de ejercicios de fracciones algebraicas racionales
interface RationalFractionsExercisesProps {
  user?: User | null;
}

const RationalFractionsExercises: React.FC<RationalFractionsExercisesProps> = ({ user }) => {
  const [exerciseType, setExerciseType] = useState<ExerciseType>(ExerciseType.BASIC);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showLatexGuide, setShowLatexGuide] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [totalExercises, setTotalExercises] = useState<number>(0);
  const [aiExercises, setAiExercises] = useState<Exercise[]>([]);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState<boolean>(false); // Nuevo estado para mostrar info de debugging

  // NUEVO: Garantizar UI correcta mediante manipulación directa del DOM
  useEffect(() => {
    // Esta función se ejecutará cada vez que cambien exerciseType o difficulty
    const applyForceUIOverride = () => {
      console.log("⚠️ FORZANDO LA UI para mostrar:", {
        difficulty: difficulty,
        exerciseType: exerciseType
      });

      setTimeout(() => {
        try {
          // 1. Buscar y forzar el elemento de tipo de ejercicio
          const typeElements = document.getElementsByClassName('exercise-type');
          if (typeElements.length > 0) {
            for (let i = 0; i < typeElements.length; i++) {
              const element = typeElements[i] as HTMLElement;
              
              // Determinar el texto correcto según el tipo seleccionado
              let typeText = "";
              switch (exerciseType) {
                case ExerciseType.BASIC:
                  typeText = "Fracciones básicas";
                  element.className = "exercise-type type-basic";
                  break;
                case ExerciseType.SIMPLIFICATION:
                  typeText = "Simplificación de fracciones racionales";
                  element.className = "exercise-type type-simplification";
                  break;
                case ExerciseType.ADDITION_SUBTRACTION:
                  typeText = "Suma y resta de fracciones racionales";
                  element.className = "exercise-type type-addition";
                  break;
                case ExerciseType.MULTIPLICATION_DIVISION:
                  typeText = "Multiplicación y división de fracciones racionales";
                  element.className = "exercise-type type-multiplication";
                  break;
                case ExerciseType.COMPLEX_OPERATIONS:
                  typeText = "Operaciones complejas con fracciones racionales";
                  element.className = "exercise-type type-complex";
                  break;
                case ExerciseType.BUSINESS_APPLICATION:
                  typeText = "Aplicaciones a finanzas y negocios";
                  element.className = "exercise-type type-business";
                  break;
              }
              
              // Asignar el texto correcto
              element.innerHTML = typeText;
              element.style.fontWeight = "bold";
            }
          }
          
          // 2. Buscar y forzar el elemento de dificultad
          const difficultyElements = document.getElementsByClassName('exercise-difficulty');
          if (difficultyElements.length > 0) {
            for (let i = 0; i < difficultyElements.length; i++) {
              const element = difficultyElements[i] as HTMLElement;
              
              // Determinar el texto correcto según la dificultad seleccionada
              let difficultyText = "";
              switch (difficulty) {
                case DifficultyLevel.EASY:
                  difficultyText = "Fácil";
                  element.className = "exercise-difficulty difficulty-easy";
                  break;
                case DifficultyLevel.MEDIUM:
                  difficultyText = "Medio";
                  element.className = "exercise-difficulty difficulty-medium";
                  break;
                case DifficultyLevel.HARD:
                  difficultyText = "Difícil";
                  element.className = "exercise-difficulty difficulty-hard";
                  break;
              }
              
              // Asignar el texto correcto
              element.innerHTML = difficultyText;
              element.style.fontWeight = "bold";
            }
          }
          
          // 3. Buscar y forzar el elemento de puntos
          const pointsElements = document.getElementsByClassName('exercise-points');
          if (pointsElements.length > 0) {
            for (let i = 0; i < pointsElements.length; i++) {
              const element = pointsElements[i] as HTMLElement;
              
              // Determinar los puntos según la dificultad
              const points = difficulty === DifficultyLevel.EASY ? 1 :
                            difficulty === DifficultyLevel.MEDIUM ? 2 : 3;
              
              // Asignar el texto correcto
              element.innerHTML = `Valor: ${points} ${points === 1 ? 'moneda' : 'monedas'}`;
              element.style.fontWeight = "bold";
            }
          }
          
          console.log("✅ UI FORZADA correctamente para mostrar la selección del usuario");
        } catch (error) {
          console.error("Error al forzar la UI:", error);
        }
      }, 50); // Un pequeño retraso para asegurar que el DOM ya está actualizado
    };
    
    // Aplicar la manipulación del DOM
    if (currentExercise) {
      applyForceUIOverride();
    }

    // También aplicar cada vez que cambie currentExercise
    const observer = new MutationObserver((mutations) => {
      applyForceUIOverride();
    });

    // Observar todo el DOM para cualquier cambio
    observer.observe(document.body, { 
      childList: true,
      subtree: true 
    });

    // Limpieza
    return () => {
      observer.disconnect();
    };
  }, [exerciseType, difficulty, currentExercise]);

  // Cargar puntos del usuario al iniciar
  useEffect(() => {
    const loadUserPoints = async () => {
      if (user?.uid) {
        try {
          // Intentar obtener perfil de usuario
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserPoints(userData.totalCoins || 0);
            setTotalExercises(userData.exercisesCompleted || 0);
          } else {
            // Si el usuario no existe, creamos un perfil básico
            await setDoc(userDocRef, {
              email: user.email,
              displayName: user.displayName,
              totalCoins: 0,
              exercisesCompleted: 0,
              created: new Date(),
              lastActive: new Date()
            });
            setUserPoints(0);
            setTotalExercises(0);
          }
        } catch (error) {
          console.error("Error loading user points:", error);
          // En caso de error, almacenamos localmente
          const localPoints = localStorage.getItem(`coins_${user.uid}`);
          if (localPoints) {
            setUserPoints(Number(localPoints));
          }
        }
      }
    };
    
    loadUserPoints();
  }, [user]);

  // NUEVO: ÚLTIMO NIVEL DE PROTECCIÓN - Detectar y corregir cualquier cambio en la UI
  useEffect(() => {
    console.log("🛡️ Estableciendo protección continua de UI");
    
    // Función para forzar UI cuando se detecten cambios
    const guardUI = () => {
      // Convertir las selecciones del usuario a textos UI
      const difficultyText = difficulty === DifficultyLevel.EASY ? "Fácil" :
                          difficulty === DifficultyLevel.MEDIUM ? "Medio" : "Difícil";
      
      const typeText = getExerciseTypeName(exerciseType);
      
      // Detectar elementos UI que no coincidan con las selecciones
      const typeElements = document.getElementsByClassName('exercise-type');
      const difficultyElements = document.getElementsByClassName('exercise-difficulty');
      
      // Corregir elementos de tipo si no coinciden
      if (typeElements.length > 0) {
        for (let i = 0; i < typeElements.length; i++) {
          const el = typeElements[i] as HTMLElement;
          if (el.innerText !== typeText) {
            console.log(`🛡️ CORRIGIENDO tipo de UI: "${el.innerText}" → "${typeText}"`);
            el.innerText = typeText;
            
            // Añadir estilos visuales según el tipo
            switch (exerciseType) {
              case ExerciseType.BASIC:
                el.className = "exercise-type type-basic";
                break;
              case ExerciseType.SIMPLIFICATION:
                el.className = "exercise-type type-simplification";
                break;
              case ExerciseType.ADDITION_SUBTRACTION:
                el.className = "exercise-type type-addition";
                break;
              case ExerciseType.MULTIPLICATION_DIVISION:
                el.className = "exercise-type type-multiplication";
                break;
              case ExerciseType.COMPLEX_OPERATIONS:
                el.className = "exercise-type type-complex";
                break;
              case ExerciseType.BUSINESS_APPLICATION:
                el.className = "exercise-type type-business";
                break;
            }
          }
        }
      }
      
      // Corregir elementos de dificultad si no coinciden
      if (difficultyElements.length > 0) {
        for (let i = 0; i < difficultyElements.length; i++) {
          const el = difficultyElements[i] as HTMLElement;
          if (el.innerText !== difficultyText) {
            console.log(`🛡️ CORRIGIENDO dificultad de UI: "${el.innerText}" → "${difficultyText}"`);
            el.innerText = difficultyText;
            
            // Añadir estilos visuales según la dificultad
            switch (difficulty) {
              case DifficultyLevel.EASY:
                el.className = "exercise-difficulty difficulty-easy";
                break;
              case DifficultyLevel.MEDIUM:
                el.className = "exercise-difficulty difficulty-medium";
                break;
              case DifficultyLevel.HARD:
                el.className = "exercise-difficulty difficulty-hard";
                break;
            }
          }
        }
      }
      
      // También verificar puntos
      const pointsElements = document.getElementsByClassName('exercise-points');
      if (pointsElements.length > 0) {
        const points = difficulty === DifficultyLevel.EASY ? 1 :
                    difficulty === DifficultyLevel.MEDIUM ? 2 : 3;
        const pointsText = `Valor: ${points} ${points === 1 ? 'moneda' : 'monedas'}`;
        
        for (let i = 0; i < pointsElements.length; i++) {
          const el = pointsElements[i] as HTMLElement;
          if (el.innerText !== pointsText) {
            console.log(`🛡️ CORRIGIENDO puntos en UI: "${el.innerText}" → "${pointsText}"`);
            el.innerText = pointsText;
          }
        }
      }
    };
    
    // Hacer corrección inmediata al montar
    if (currentExercise) {
      guardUI();
    }
    
    // Establecer MutationObserver para detectar cambios en el DOM
    const observer = new MutationObserver((mutations) => {
      // Verificar si alguna mutación afecta elementos relevantes
      let needsCorrection = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const targetEl = mutation.target as Element;
          const targetParent = targetEl.parentElement;
          
          // Verificar si el cambio afecta a nuestros elementos de interés
          if (targetEl.classList?.contains('exercise-type') || 
              targetEl.classList?.contains('exercise-difficulty') ||
              targetEl.classList?.contains('exercise-points') ||
              targetParent?.classList?.contains('exercise-type') ||
              targetParent?.classList?.contains('exercise-difficulty') ||
              targetParent?.classList?.contains('exercise-points')) {
            needsCorrection = true;
            break;
          }
        }
      }
      
      // Si se detecta un cambio en elementos relevantes, forzar la UI correcta
      if (needsCorrection && currentExercise) {
        console.log("🛡️ CAMBIO DETECTADO EN UI - aplicando corrección");
        guardUI();
      }
    });
    
    // Iniciar observación del DOM
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, [exerciseType, difficulty, currentExercise]);

  // Generar un nuevo ejercicio
  const generateNewExercise = () => {
    const exercise = generateExercise(exerciseType, difficulty);
    setCurrentExercise(exercise);
    setUserAnswer('');
    setShowSolution(false);
    setIsCorrect(null);
  };

  // Verificar respuesta con mejor manejo
  const checkAnswer = async () => {
    if (!currentExercise) return;

    // Normalizar respuestas removiendo espacios y convirtiendo a minúsculas
    let normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase();
    let normalizedSolution = currentExercise.solution.replace(/\s+/g, '').toLowerCase();
    
    // Reemplazar caracteres especiales por equivalentes
    normalizedUserAnswer = normalizedUserAnswer
      .replace(/\^(\d+)/g, '^$1') // Mantener exponentes
      .replace(/\*/g, '') // Remover asteriscos de multiplicación
      .replace(/sqrt/g, '√') // Reemplazar sqrt por √
      .replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2'); // Convertir \frac{a}{b} a a/b
      
    normalizedSolution = normalizedSolution
      .replace(/\^(\d+)/g, '^$1')
      .replace(/\*/g, '')
      .replace(/sqrt/g, '√')
      .replace(/\\frac{([^{}]+)}{([^{}]+)}/g, '$1/$2');
    
    // Verificar múltiples formas válidas de la solución cuando aplique
    let correct = normalizedUserAnswer === normalizedSolution;
    
    // Si no coincide exactamente, verificar si son equivalentes algebraicamente
    // (Esta es una simplificación, en un caso real se necesitaría un evaluador de expresiones algebraicas)
    if (!correct) {
      // Si la solución tiene forma de fracción a/b, también aceptamos formas como a/b = c
      const userParts = normalizedUserAnswer.split('=');
      if (userParts.length > 1) {
        // Si el usuario incluye un paso de simplificación, verificamos la parte izquierda
        correct = userParts[0].trim() === normalizedSolution;
      }
    }
    
    setIsCorrect(correct);
    
    // Si es correcto y hay un usuario, actualizar puntos
    if (correct && user?.uid) {
      try {
        // Actualizar monedas en Firebase
        const result = await addCoinsToUser(user.uid, currentExercise.points);
        if (result) {
          setUserPoints(result.totalCoins);
          setTotalExercises(result.exercisesCompleted);
        }
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
      <h4>Guía para escribir fórmulas matemáticas</h4>
      <ul>
        <li>Exponentes: <code>x^2</code> para x²</li>
        <li>Fracciones: <code>\\frac&#123;numerador&#125;&#123;denominador&#125;</code> o <code>(numerador)/(denominador)</code></li>
        <li>Raíz cuadrada: <code>\\sqrt&#123;x&#125;</code> para √x</li>
        <li>Productos: <code>2x</code> o <code>2*x</code> para 2x</li>
        <li>Exponentes negativos: <code>x^(-1)</code> para x⁻¹</li>
        <li>Paréntesis: Use <code>(</code> y <code>)</code> para agrupar expresiones</li>
      </ul>
      <p>Ejemplos:</p>
      <ul>
        <li><code>\\frac&#123;x+1&#125;&#123;x-2&#125;</code> - Fracción con x+1 en el numerador y x-2 en el denominador</li>
        <li><code>x^2 + 2x + 1</code> - Polinomio cuadrático</li>
        <li><code>\\frac&#123;3x&#125;&#123;4&#125; + \\frac&#123;x&#125;&#123;2&#125;</code> - Suma de fracciones</li>
      </ul>
    </div>
  );

  // Obtener nombre del tipo de ejercicio según su enum
  const getExerciseTypeName = (type: ExerciseType): string => {
    switch (type) {
      case ExerciseType.BASIC:
        return 'Fracciones básicas';
      case ExerciseType.SIMPLIFICATION:
        return 'Simplificación de fracciones racionales';
      case ExerciseType.ADDITION_SUBTRACTION:
        return 'Suma y resta de fracciones racionales';
      case ExerciseType.MULTIPLICATION_DIVISION:
        return 'Multiplicación y división de fracciones racionales';
      case ExerciseType.COMPLEX_OPERATIONS:
        return 'Operaciones complejas con fracciones racionales';
      case ExerciseType.BUSINESS_APPLICATION:
        return 'Aplicaciones a finanzas y negocios';
      default:
        return 'Desconocido';
    }
  };

  // NUEVO: Función para mapear los strings de tipo a valores enum
  const mapStringTypeToEnum = (typeStr: string): ExerciseType => {
    // Mapeo explícito desde valores de string a valores enum
    switch(typeStr) {
      case 'simplification':
        return ExerciseType.SIMPLIFICATION;
      case 'addition_subtraction':
        return ExerciseType.ADDITION_SUBTRACTION;
      case 'multiplication_division':
        return ExerciseType.MULTIPLICATION_DIVISION;
      case 'complex_operations':
        return ExerciseType.COMPLEX_OPERATIONS;
      case '':
        // Si no hay tipo especificado, usar el tipo actualmente seleccionado
        return exerciseType;
      default:
        console.warn(`Tipo no reconocido: "${typeStr}", usando tipo seleccionado: ${exerciseType}`);
        return exerciseType;
    }
  };
  
  // NUEVO: Función para mapear los strings de dificultad a valores enum
  const mapStringDifficultyToEnum = (diffStr: string): DifficultyLevel => {
    // Mapeo explícito desde valores de string a valores enum
    switch(diffStr) {
      case 'easy':
        return DifficultyLevel.EASY;
      case 'medium':
        return DifficultyLevel.MEDIUM;
      case 'hard':
        return DifficultyLevel.HARD;
      default:
        console.warn(`Dificultad no reconocida: "${diffStr}", usando dificultad seleccionada: ${difficulty}`);
        return difficulty;
    }
  };

  // Manejar generación de ejercicios con IA
  const handleAIExercisesGenerated = (generatedExercises: any[]) => {
    console.log("⚡ EJERCICIOS RECIBIDOS DEL GENERADOR:", generatedExercises);
    console.log("⚡ VALORES ACTUALES UI: Tipo:", exerciseType, "Dificultad:", difficulty);
    
    // IMPLEMENTACIÓN EXTREMA: Ignorar completamente cualquier metadata de los ejercicios,
    // y usar EXCLUSIVAMENTE lo que el usuario seleccionó en la interfaz, pero mantener los valores de display
    
    // Almacenar en localStorage para debugging
    localStorage.setItem('rational_fractions_selections', JSON.stringify({
      timestamp: new Date().toString(),
      exerciseType: exerciseType,
      difficulty: difficulty,
      exercisesCount: generatedExercises.length
    }));
    
    // Convertir el formato de ejercicios de la IA al formato usado en este componente
    // Mantener displayType y displayDifficulty si existen
    const forcedExercises = generatedExercises.map(ex => {
      // NUEVO: Si el ejercicio tiene typeOverride o difficultyOverride, usarlos primero
      const selectedType = ex.typeOverride 
        ? mapStringTypeToEnum(ex.typeOverride) 
        : exerciseType;
        
      const selectedDifficulty = ex.difficultyOverride 
        ? mapStringDifficultyToEnum(ex.difficultyOverride) 
        : difficulty;
      
      // NUEVO: Preservar los valores de display de la UI si existen
      const preservedDisplayType = ex.displayType || null;
      const preservedDisplayDifficulty = ex.displayDifficulty || null;
      
      console.log("⚡ MAPEANDO VALORES:", {
        typeOverride: ex.typeOverride,
        difficultyOverride: ex.difficultyOverride,
        resultingType: selectedType,
        resultingDifficulty: selectedDifficulty,
        displayType: preservedDisplayType,
        displayDifficulty: preservedDisplayDifficulty
      });
      
      return {
        id: generateId(),
        // FORZAR UI: Usar EXCLUSIVAMENTE los valores seleccionados por el usuario
        type: selectedType,         // FORZAR el tipo seleccionado en la UI
        difficulty: selectedDifficulty,      // FORZAR la dificultad seleccionada en la UI
        // Mantener contenido del ejercicio
        problem: ex.problem || "x^2 + 5x + 6",
        solution: ex.solution || "(x + 2)(x + 3)",
        hint: ex.hint || "Intenta factorizar numerador y denominador cuando sea posible.",
        // Preservar los valores de display
        displayType: preservedDisplayType,
        displayDifficulty: preservedDisplayDifficulty,
        // FORZAR puntos según la dificultad seleccionada en la UI
        points: selectedDifficulty === DifficultyLevel.EASY ? 1 : 
                selectedDifficulty === DifficultyLevel.MEDIUM ? 2 : 3,
        // Agregar metadatos de forzado para debugging
        _forced: {
          timestamp: Date.now(),
          originalType: exerciseType,
          originalDifficulty: difficulty,
          source: "handleAIExercisesGenerated"
        }
      };
    });
    
    console.log("⚡ EJERCICIOS TRANSFORMADOS con valores UI FORZADOS:", forcedExercises);
    
    setAiExercises(forcedExercises);
    
    if (forcedExercises.length > 0) {
      // Establecer el ejercicio actual con los valores UI forzados
      setCurrentExercise(forcedExercises[0]);
      setUserAnswer('');
      setShowSolution(false);
      setIsCorrect(null);
      
      // Forzar la actualización de la UI después de un breve retraso
      setTimeout(() => {
        try {
          // Forzar actualización de elementos visuales
          const typeElements = document.getElementsByClassName('exercise-type');
          const difficultyElements = document.getElementsByClassName('exercise-difficulty');
          
          if (typeElements.length > 0) {
            for (let i = 0; i < typeElements.length; i++) {
              const el = typeElements[i] as HTMLElement;
              // Asignar texto según el tipo seleccionado
              el.innerText = getExerciseTypeName(exerciseType);
            }
          }
          
          if (difficultyElements.length > 0) {
            for (let i = 0; i < difficultyElements.length; i++) {
              const el = difficultyElements[i] as HTMLElement;
              // Asignar texto según la dificultad seleccionada
              el.innerText = difficulty;
            }
          }
          
          console.log("⚡ UI actualizada forzadamente después de establecer ejercicio");
        } catch (e) {
          console.error("Error al forzar actualización de UI:", e);
        }
      }, 100);
    } else {
      console.error("No se recibieron ejercicios válidos del generador");
      setError("No se pudieron generar ejercicios. Intente de nuevo.");
    }
  };

  // Renderizar ejercicio actual
  const renderCurrentExercise = () => {
    if (!currentExercise) {
      return (
        <div className="factorization-exercises-empty">
          <p>No hay ejercicios activos. Genera uno nuevo utilizando las opciones anteriores.</p>
          <button className="generate-button" onClick={generateNewExercise}>
            Generar ejercicio
          </button>
        </div>
      );
    }

    // NUEVO: Usar displayType y displayDifficulty directamente del ejercicio si existen
    const displayType = (currentExercise as any).displayType 
      ? (currentExercise as any).displayType 
      : getExerciseTypeName(exerciseType);
    
    const displayDifficulty = (currentExercise as any).displayDifficulty 
      ? (currentExercise as any).displayDifficulty
      : difficulty === DifficultyLevel.EASY ? "Fácil" :
        difficulty === DifficultyLevel.MEDIUM ? "Medio" : "Difícil";
    
    // Clases CSS basadas EXCLUSIVAMENTE en el estado del componente
    const difficultyClass = difficulty === DifficultyLevel.EASY ? "difficulty-easy" :
                         difficulty === DifficultyLevel.MEDIUM ? "difficulty-medium" : "difficulty-hard";
    
    let typeClass;
    switch (exerciseType) {
      case ExerciseType.BASIC:
        typeClass = "type-basic";
        break;
      case ExerciseType.SIMPLIFICATION:
        typeClass = "type-simplification";
        break;
      case ExerciseType.ADDITION_SUBTRACTION:
        typeClass = "type-addition";
        break;
      case ExerciseType.MULTIPLICATION_DIVISION:
        typeClass = "type-multiplication";
        break;
      case ExerciseType.COMPLEX_OPERATIONS:
        typeClass = "type-complex";
        break;
      case ExerciseType.BUSINESS_APPLICATION:
        typeClass = "type-business";
        break;
      default:
        typeClass = "type-basic";
    }
    
    // Puntos basados EXCLUSIVAMENTE en el estado del componente
    const displayPoints = difficulty === DifficultyLevel.EASY ? 1 : 
                        difficulty === DifficultyLevel.MEDIUM ? 2 : 3;

    // Guardar valores UI en localStorage para debugging
    try {
      localStorage.setItem('current_exercise_ui', JSON.stringify({
        timestamp: new Date().toString(),
        displayType: displayType,
        displayDifficulty: displayDifficulty,
        displayPoints: displayPoints,
        stateType: exerciseType,
        stateDifficulty: difficulty,
        currentExerciseType: currentExercise.type,
        currentExerciseDifficulty: currentExercise.difficulty,
        hasDisplayProperties: !!(currentExercise as any).displayType
      }));
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
    
    console.log("🎯 RENDERIZANDO EJERCICIO con UI forzada:", {
      displayType,
      displayDifficulty,
      displayPoints,
      originalType: currentExercise.type,
      originalDifficulty: currentExercise.difficulty
    });

    return (
      <div className="exercise-container">
        <div className="exercise-header">
          {/* Tipo - Usar displayType si existe */}
          <div className={`exercise-type ${typeClass}`} style={{fontWeight: 'bold'}}>
            {displayType}
          </div>
          
          {/* Dificultad - Usar displayDifficulty si existe */}
          <div className={`exercise-difficulty ${difficultyClass}`} style={{fontWeight: 'bold'}}>
            {displayDifficulty}
          </div>
          
          {/* Puntos - Siempre desde el estado */}
          <div className="exercise-points" style={{fontWeight: 'bold'}}>
            Valor: {displayPoints} {displayPoints === 1 ? 'moneda' : 'monedas'}
          </div>
        </div>

        {currentExercise.context && (
          <div className="exercise-context">{currentExercise.context}</div>
        )}

        <div className="exercise-problem">
          <h3>Resuelve la siguiente expresión:</h3>
          <div className="problem-display">
            <BlockMath math={currentExercise ? currentExercise.problem : ""} />
          </div>
        </div>

        {currentExercise.hint && !showSolution && isCorrect === false && (
          <div className="exercise-hint">
            <strong>Pista:</strong> {currentExercise.hint}
          </div>
        )}

        {isCorrect === true && (
          <div className="correct-feedback">
            ¡Correcto! Has ganado {displayPoints} {displayPoints === 1 ? 'moneda' : 'monedas'}.
          </div>
        )}

        {showSolution && (
          <div className="solution-display">
            <h4>Solución:</h4>
            <BlockMath math={currentExercise ? currentExercise.solution : ""} />
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
              title="Mostrar/ocultar guía de LaTeX"
            >
              ?
            </button>
          </div>
          {showLatexGuide && <LatexGuide />}
        </div>

        <div className="exercise-buttons">
          {isCorrect === null && (
            <button className="check-button" onClick={checkAnswer}>
              Verificar
            </button>
          )}
          
          {isCorrect === false && !showSolution && (
            <button className="hint-button" onClick={revealSolution}>
              Ver solución
            </button>
          )}
          
          {(isCorrect !== null || showSolution) && (
            <button className="next-button" onClick={nextExercise}>
              Siguiente ejercicio
            </button>
          )}
        </div>
      </div>
    );
  };

  // NUEVO: Función de debugging para diagnosticar problemas
  const debugExerciseState = () => {
    console.log("🔍 ESTADO ACTUAL:");
    console.log("- Tipo seleccionado:", exerciseType);
    console.log("- Dificultad seleccionada:", difficulty);
    console.log("- Ejercicio actual:", currentExercise);
    
    if (currentExercise) {
      console.log("- Tipo del ejercicio actual:", currentExercise.type);
      console.log("- Dificultad del ejercicio actual:", currentExercise.difficulty);
    }
    
    console.log("- Ejercicios AI disponibles:", aiExercises.length);
    
    // Verificar diferencias entre selección y ejercicio actual
    if (currentExercise) {
      if (currentExercise.type !== exerciseType) {
        console.warn("⚠️ DISCREPANCIA: El tipo del ejercicio no coincide con la selección");
      }
      if (currentExercise.difficulty !== difficulty) {
        console.warn("⚠️ DISCREPANCIA: La dificultad del ejercicio no coincide con la selección");
      }
    }
    
    // Verificar elementos UI
    const typeElements = document.getElementsByClassName('exercise-type');
    const difficultyElements = document.getElementsByClassName('exercise-difficulty');
    
    if (typeElements.length > 0) {
      console.log("- Texto de tipo en UI:", (typeElements[0] as HTMLElement).innerText);
    }
    
    if (difficultyElements.length > 0) {
      console.log("- Texto de dificultad en UI:", (difficultyElements[0] as HTMLElement).innerText);
    }
    
    // Forzar inmediatamente la UI
    try {
      const typeText = getExerciseTypeName(exerciseType);
      const difficultyText = difficulty === DifficultyLevel.EASY ? "Fácil" :
                           difficulty === DifficultyLevel.MEDIUM ? "Medio" : "Difícil";
      
      for (let i = 0; i < typeElements.length; i++) {
        (typeElements[i] as HTMLElement).innerText = typeText;
      }
      
      for (let i = 0; i < difficultyElements.length; i++) {
        (difficultyElements[i] as HTMLElement).innerText = difficultyText;
      }
      
      console.log("✅ UI forzada durante el debugging");
    } catch (e) {
      console.error("Error forzando UI durante debugging:", e);
    }
    
    // Alternar visualización del panel de debugging
    setShowDebug(current => !current);
  };

  return (
    <div className="factorization-exercises-container">
      <div className="factorization-exercises-header">
        <div className="section-title">
          <h2>Fracciones Algebraicas Racionales</h2>
          <p className="section-description">
            Aprende a resolver operaciones con fracciones algebraicas racionales, desde ejercicios básicos hasta aplicaciones en finanzas y negocios.
          </p>
        </div>
        <div className="user-info">
          {user && (
            <>
              <div className="user-points">
                <span className="coin-icon">🪙</span>
                <span className="points-value">{userPoints}</span>
              </div>
              <div className="user-exercises">
                <span className="exercises-label">Ejercicios:</span>
                <span className="exercises-value">{totalExercises}</span>
              </div>
              {/* NUEVO: Botón de debugging */}
              <div className="debug-button" onClick={debugExerciseState} title="Diagnosticar problemas">
                🔍
              </div>
            </>
          )}
        </div>
      </div>

      {/* NUEVO: Panel de información de debugging */}
      {showDebug && (
        <div className="debug-panel" style={{
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          padding: '10px',
          margin: '10px 0',
          fontSize: '12px'
        }}>
          <h4>Información de Debugging</h4>
          <p><strong>Tipo seleccionado:</strong> {exerciseType} ({getExerciseTypeName(exerciseType)})</p>
          <p><strong>Dificultad seleccionada:</strong> {difficulty}</p>
          {currentExercise && (
            <>
              <p><strong>Tipo del ejercicio actual:</strong> {currentExercise.type} ({getExerciseTypeName(currentExercise.type)})</p>
              <p><strong>Dificultad del ejercicio actual:</strong> {currentExercise.difficulty}</p>
              <p><strong>¿Coinciden?</strong> {(currentExercise.type === exerciseType && currentExercise.difficulty === difficulty) ? '✅ Sí' : '❌ No'}</p>
            </>
          )}
          <button onClick={() => {
            // Forzar ejercicio para que coincida con la selección
            if (currentExercise) {
              const fixedExercise = {
                ...currentExercise,
                type: exerciseType,
                difficulty: difficulty
              };
              setCurrentExercise(fixedExercise);
              console.log("✅ Ejercicio corregido forzosamente para coincidir con la selección");
            }
          }}>Forzar coincidencia</button>
          <button onClick={() => setShowDebug(false)}>Cerrar</button>
        </div>
      )}

      <div className="exercise-controls">
        <div className="control-group">
          <label htmlFor="exercise-type">Tipo de ejercicio:</label>
          <select 
            id="exercise-type" 
            value={exerciseType} 
            onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
          >
            <option value={ExerciseType.BASIC}>Fracciones básicas</option>
            <option value={ExerciseType.SIMPLIFICATION}>Simplificación de fracciones</option>
            <option value={ExerciseType.ADDITION_SUBTRACTION}>Suma y resta</option>
            <option value={ExerciseType.MULTIPLICATION_DIVISION}>Multiplicación y división</option>
            <option value={ExerciseType.COMPLEX_OPERATIONS}>Operaciones complejas</option>
            <option value={ExerciseType.BUSINESS_APPLICATION}>Aplicaciones a finanzas y negocios</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select 
            id="difficulty" 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          >
            <option value={DifficultyLevel.EASY}>Fácil (1 moneda)</option>
            <option value={DifficultyLevel.MEDIUM}>Medio (2 monedas)</option>
            <option value={DifficultyLevel.HARD}>Difícil (3 monedas)</option>
          </select>
        </div>
        
        <button className="generate-button" onClick={generateNewExercise}>
          Generar ejercicio
        </button>
        
        <button 
          className="ai-toggle-button" 
          onClick={() => setShowAiGenerator(!showAiGenerator)}
        >
          {showAiGenerator ? 'Ocultar generador IA' : 'Mostrar generador IA'}
        </button>
      </div>

      <div className="introduction-section">
        <h3>Introducción a las Fracciones Algebraicas Racionales</h3>
        <p>
          Las fracciones algebraicas racionales son expresiones de la forma P(x)/Q(x) donde P(x) y Q(x) son polinomios y Q(x) ≠ 0.
          En esta sección, aprenderás a simplificar, sumar, restar, multiplicar y dividir fracciones algebraicas.
        </p>
        <p>
          Recuerda que al trabajar con fracciones algebraicas:
        </p>
        <ul>
          <li>Para simplificar, factoriza numerador y denominador y cancela factores comunes.</li>
          <li>Para sumar o restar, necesitas un denominador común.</li>
          <li>Para multiplicar, multiplica numeradores entre sí y denominadores entre sí.</li>
          <li>Para dividir, multiplica por el recíproco de la segunda fracción.</li>
        </ul>
        <p>
          Al escribir tus respuestas, usa la notación LaTeX. Puedes presionar el botón "?" para ver la guía completa.
        </p>
      </div>

      {showAiGenerator && (
        <AIExerciseGenerator 
          topic="rationalfractions"
          onExercisesGenerated={handleAIExercisesGenerated}
        />
      )}

      {renderCurrentExercise()}
    </div>
  );
};

export default RationalFractionsExercises; 