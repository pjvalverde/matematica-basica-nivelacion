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
        exercise.solution = `\\frac{x}{(x-${a})(x+${a})} - \\frac{1}{x-${a}} + \\frac{1}{x+${a}} = \\frac{x - (x+${a}) + (x-${a})}{(x-${a})(x+${a})} = \\frac{x - x - ${a} + x - ${a}}{(x-${a})(x+${a})} = \\frac{x - 2${a}}{(x-${a})(x+${a})}`;
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

  // Manejar generación de ejercicios con IA
  const handleAIExercisesGenerated = (generatedExercises: any[]) => {
    console.log("Recibidos ejercicios generados por IA:", generatedExercises);
    
    // IMPORTANTE: Usar la selección actual para los ejercicios, independientemente de los metadatos
    // Esto garantiza que se respete lo que el usuario seleccionó
    
    // Convertir el formato de ejercicios de la IA al formato usado en este componente
    const formattedExercises = generatedExercises.map(ex => {
      // FORZAR el tipo y dificultad según la selección actual del usuario
      // Esto asegura que se respete lo que el usuario seleccionó
      return {
        id: generateId(),
        type: exerciseType, // USAR SIEMPRE la selección del usuario
        difficulty: difficulty, // USAR SIEMPRE la selección del usuario
        problem: ex.problem,
        solution: ex.solution,
        hint: ex.hint || "Intenta factorizar numerador y denominador cuando sea posible.",
        points: difficulty === DifficultyLevel.EASY ? 1 : 
                difficulty === DifficultyLevel.MEDIUM ? 2 : 3
      };
    });
    
    console.log("Ejercicios formateados con tipo forzado:", formattedExercises);
    console.log("Usando FORZOSAMENTE tipo: ", exerciseType, " y dificultad: ", difficulty);
    
    setAiExercises(formattedExercises);
    
    if (formattedExercises.length > 0) {
      setCurrentExercise(formattedExercises[0]);
      setUserAnswer('');
      setShowSolution(false);
      setIsCorrect(null);
    } else {
      console.error("No se recibieron ejercicios válidos de la IA");
      setError("No se pudieron generar ejercicios con IA. Intente de nuevo.");
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

    // MODIFICACIÓN CRUCIAL: Forzar el tipo y dificultad seleccionados por el usuario
    // para asegurar que lo que se muestra coincide con lo que el usuario seleccionó
    const displayType = exerciseType;  // Usar SIEMPRE el tipo seleccionado por el usuario
    const displayDifficulty = difficulty;  // Usar SIEMPRE la dificultad seleccionada por el usuario
    const displayPoints = displayDifficulty === DifficultyLevel.EASY ? 1 : 
                        displayDifficulty === DifficultyLevel.MEDIUM ? 2 : 3;

    console.log('RENDERIZANDO EJERCICIO CON TIPO Y DIFICULTAD FORZADOS:');
    console.log('- Tipo seleccionado por usuario:', exerciseType);
    console.log('- Tipo original del ejercicio:', currentExercise.type);
    console.log('- Dificultad seleccionada por usuario:', difficulty);
    console.log('- Dificultad original del ejercicio:', currentExercise.difficulty);

    return (
      <div className="exercise-container">
        <div className="exercise-header">
          <div className="exercise-type">{getExerciseTypeName(displayType)}</div>
          <div className="exercise-difficulty">{displayDifficulty}</div>
          <div className="exercise-points">Valor: {displayPoints} {displayPoints === 1 ? 'moneda' : 'monedas'}</div>
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
            </>
          )}
        </div>
      </div>

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