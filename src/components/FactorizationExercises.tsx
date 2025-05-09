import React, { useState, useEffect, useContext } from 'react';
import { BlockMath, InlineMath } from '../utils/MathRenderer';
import './FactorizationExercises.css';
import { addCoinsToUser, getUserProfile } from '../firebase/userService';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AIExerciseGenerator from './AIExerciseGenerator';

// Tipos de ejercicios
enum ExerciseType {
  BASIC = 'basic',
  COMPLETE_SQUARE = 'complete_square',
  DIFFERENCE_SQUARES = 'difference_squares',
  PERFECT_CUBE = 'perfect_cube',
  BUSINESS_APPLICATION = 'business_application',
  PDF_BASED = 'pdf_based'
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
      exercise.points = 2; // Cambiado de 3 a 2 según la petición
      break;
    case DifficultyLevel.HARD:
      exercise.points = 3; // Cambiado de 5 a 3 según la petición
      break;
  }

  // Generar ejercicio según el tipo
  switch (type) {
    case ExerciseType.BASIC:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        exercise.problem = `${a}x^2 + ${a * b}x`;
        exercise.solution = `${a}x(x + ${b})`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        exercise.problem = `${a}x^2 + ${a * b}x + ${a * c}`;
        exercise.solution = `${a}(x^2 + ${b}x + ${c})`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        exercise.problem = `${a}x^3 + ${a * b}x^2 + ${a * c}x + ${a * d}`;
        exercise.solution = `${a}(x^3 + ${b}x^2 + ${c}x + ${d})`;
        exercise.hint = `Busca el máximo común divisor de todos los términos.`;
      }
      break;

    case ExerciseType.COMPLETE_SQUARE:
      if (difficulty === DifficultyLevel.EASY) {
        const a = 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const bSquared = b * b;
        exercise.problem = `x^2 + ${2 * b}x + ${bSquared}`;
        exercise.solution = `(x + ${b})^2`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 3) + 2;
        const b = Math.floor(Math.random() * 10) + 1;
        const bSquared = b * b;
        exercise.problem = `${a}x^2 + ${2 * a * b}x + ${a * bSquared}`;
        exercise.solution = `${a}(x + ${b})^2`;
        exercise.hint = `Busca un factor común y completa el cuadrado.`;
      } else {
        const a = Math.floor(Math.random() * 3) + 2;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 10) + 1;
        const bSquared = b * b;
        exercise.problem = `${a}x^2 + ${2 * a * b}x + ${a * bSquared} + ${c}`;
        exercise.solution = `${a}(x + ${b})^2 + ${c}`;
        exercise.hint = `Agrupa los términos que pueden formar un cuadrado perfecto.`;
      }
      break;

    case ExerciseType.DIFFERENCE_SQUARES:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `${a * a}x^2 - ${b * b}`;
        exercise.solution = `(${a}x + ${b})(${a}x - ${b})`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `${a * a}x^2 - ${b * b}y^2`;
        exercise.solution = `(${a}x + ${b}y)(${a}x - ${b}y)`;
        exercise.hint = `Recuerda la fórmula de la diferencia de cuadrados: a² - b² = (a + b)(a - b)`;
      } else {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * 5) + 1;
        exercise.problem = `${a * a}x^${2 * c} - ${b * b}y^${2 * d}`;
        exercise.solution = `(${a}x^${c} + ${b}y^${d})(${a}x^${c} - ${b}y^${d})`;
        exercise.hint = `Identifica los términos que pueden representarse como cuadrados.`;
      }
      break;

    case ExerciseType.PERFECT_CUBE:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        exercise.problem = `x^3 + ${3 * a * a * b}x + ${a * a * a}`;
        exercise.solution = `(x + ${a})^3`;
        exercise.hint = `Recuerda la fórmula del cubo perfecto: a³ + 3a²b + 3ab² + b³ = (a + b)³`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        exercise.problem = `x^3 - ${3 * a * a * b}x + ${a * a * a}`;
        exercise.solution = `(x - ${a})^3`;
        exercise.hint = `Aplica la fórmula del cubo perfecto con b negativo.`;
      } else {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        const c = Math.floor(Math.random() * 5) + 2;
        exercise.problem = `${c}x^3 + ${3 * c * a * b * b}x^2 + ${3 * c * a * a * b}x + ${c * a * a * a}`;
        exercise.solution = `${c}(x + ${a})^3`;
        exercise.hint = `Busca un factor común y aplica la fórmula del cubo perfecto.`;
      }
      break;

    case ExerciseType.BUSINESS_APPLICATION:
      if (difficulty === DifficultyLevel.EASY) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 10) + 10;
        exercise.problem = `${a}x^2 + ${a * b}x`;
        exercise.solution = `${a}x(x + ${b})`;
        exercise.context = `Una empresa de marketing digital observa que sus ingresos siguen un patrón representado por la función I(x) = ${a}x^2 + ${a * b}x, donde x es el número de campañas publicitarias. Factoriza esta expresión para entender mejor la estructura de ingresos.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const a = Math.floor(Math.random() * 10) + 10;
        const b = Math.floor(Math.random() * 10) + 10;
        const c = a * b;
        exercise.problem = `x^2 - ${a + b}x + ${c}`;
        exercise.solution = `(x - ${a})(x - ${b})`;
        exercise.context = `El beneficio de un producto financiero está modelado por la función B(x) = x^2 - ${a + b}x + ${c}, donde x representa la inversión inicial en miles de euros. Factoriza esta expresión para encontrar los puntos donde el beneficio es cero.`;
        exercise.hint = `Busca dos números que multiplicados den ${c} y sumados den ${a + b}.`;
      } else {
        const p = Math.floor(Math.random() * 50) + 50;
        const a = 1;
        const b = -p;
        const c = Math.floor(p / 2) * p;
        exercise.problem = `${a}x^2 + ${b}x + ${c}`;
        exercise.solution = `${a}(x - ${p/2})^2 + ${c - (p*p/4)}`;
        exercise.context = `Un analista de negocios ha determinado que el coste total de producción de cierto artículo viene dado por C(x) = ${a}x^2 + ${b}x + ${c}, donde x es el número de unidades producidas. Reescribe esta expresión completando el cuadrado para determinar el número óptimo de unidades que minimiza el coste.`;
        exercise.hint = `Completa el cuadrado para encontrar la forma C(x) = a(x - h)² + k.`;
      }
      break;

    case ExerciseType.PDF_BASED:
      let pdfExercises: { [key: string]: { expression: string, solution: string, hint: string }[] } = {
        [DifficultyLevel.EASY]: [
          { 
            expression: '15x^2 - 20x', 
            solution: '5x(3x - 4)', 
            hint: 'Factoriza usando el factor común' 
          },
          { 
            expression: '6x^2 - 9x', 
            solution: '3x(2x - 3)', 
            hint: 'Busca un factor común entre los términos' 
          },
          { 
            expression: 'x^2 - 16', 
            solution: '(x - 4)(x + 4)', 
            hint: 'Es una diferencia de cuadrados' 
          }
        ],
        [DifficultyLevel.MEDIUM]: [
          { 
            expression: 'x^2 - 6x + 9', 
            solution: '(x - 3)^2', 
            hint: 'Es un trinomio cuadrado perfecto' 
          },
          { 
            expression: '4x^2 - 25', 
            solution: '(2x - 5)(2x + 5)', 
            hint: 'Es una diferencia de cuadrados' 
          },
          { 
            expression: 'x^3 - 8', 
            solution: '(x - 2)(x^2 + 2x + 4)', 
            hint: 'Es una diferencia de cubos' 
          }
        ],
        [DifficultyLevel.HARD]: [
          { 
            expression: 'x^4 - 16', 
            solution: '(x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)', 
            hint: 'Factoriza por etapas, primero como diferencia de cuadrados' 
          },
          { 
            expression: '2x^3 - 54x', 
            solution: '2x(x^2 - 27) = 2x(x - 3√3)(x + 3√3)', 
            hint: 'Encuentra primero el factor común, luego factoriza la diferencia de cuadrados' 
          },
          { 
            expression: 'x^3 + 27', 
            solution: '(x + 3)(x^2 - 3x + 9)', 
            hint: 'Es una suma de cubos' 
          }
        ]
      };
      
      const pdfExerciseOptions = pdfExercises[difficulty];
      const selectedPdfExercise = pdfExerciseOptions[Math.floor(Math.random() * pdfExerciseOptions.length)];
      
      return {
        id,
        type,
        difficulty,
        problem: selectedPdfExercise.expression,
        solution: selectedPdfExercise.solution,
        hint: selectedPdfExercise.hint,
        points: exercise.points
      };
  }

  return exercise;
};

// Componente principal de ejercicios de factorización
interface FactorizationExercisesProps {
  user?: User | null;
}

const FactorizationExercises: React.FC<FactorizationExercisesProps> = ({ user }) => {
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
        <li>Fracciones: <code>(x+y)/(a+b)</code> para (x+y)/(a+b)</li>
        <li>Raíz cuadrada: <code>sqrt(x)</code> para √x</li>
        <li>Productos: <code>2x</code> o <code>2*x</code> para 2x</li>
        <li>Exponentes negativos: <code>x^(-1)</code> para x⁻¹</li>
        <li>Potencias cúbicas: <code>x^3</code> para x³</li>
        <li>Paréntesis: Use <code>(</code> y <code>)</code> para agrupar expresiones</li>
      </ul>
    </div>
  );

  // Manejar generación de ejercicios con IA
  const handleAIExercisesGenerated = (generatedExercises: any[]) => {
    console.log("Recibidos ejercicios generados por IA:", generatedExercises);
    
    // Convertir el formato de ejercicios de la IA al formato usado en este componente
    const formattedExercises = generatedExercises.map(ex => {
      // Valores por defecto (usados si no hay metadatos)
      let exerciseTypeToUse = ExerciseType.PDF_BASED;
      let difficultyToUse = difficulty;
      
      // Si el ejercicio tiene metadatos, usarlos para preservar la selección del usuario
      if (ex.metadata) {
        console.log("Ejercicio con metadatos:", ex.metadata);
        
        // Mapear el tipo de ejercicio según los metadatos
        if (ex.metadata.type) {
          if (ex.metadata.type.includes('factor común')) {
            exerciseTypeToUse = ExerciseType.BASIC;
            console.log("Estableciendo tipo: Factor común");
          } else if (ex.metadata.type.includes('cuadrados') || ex.metadata.type.includes('diferencia de cuadrados')) {
            exerciseTypeToUse = ExerciseType.DIFFERENCE_OF_SQUARES;
            console.log("Estableciendo tipo: Diferencia de cuadrados");
          } else if (ex.metadata.type.includes('trinomio cuadrado') || ex.metadata.type.includes('perfecto')) {
            exerciseTypeToUse = ExerciseType.PERFECT_SQUARE_TRINOMIAL;
            console.log("Estableciendo tipo: Trinomio cuadrado perfecto");
          } else if (ex.metadata.type.includes('trinomio de la forma') || ex.metadata.type.includes('general')) {
            exerciseTypeToUse = ExerciseType.GENERAL_TRINOMIAL;
            console.log("Estableciendo tipo: Trinomio general");
          }
        }
        
        // Mapear la dificultad según los metadatos
        if (ex.metadata.difficulty) {
          if (ex.metadata.difficulty === 'easy') {
            difficultyToUse = DifficultyLevel.EASY;
            console.log("Estableciendo dificultad: Fácil");
          } else if (ex.metadata.difficulty === 'medium') {
            difficultyToUse = DifficultyLevel.MEDIUM;
            console.log("Estableciendo dificultad: Medio");
          } else if (ex.metadata.difficulty === 'hard') {
            difficultyToUse = DifficultyLevel.HARD;
            console.log("Estableciendo dificultad: Difícil");
          }
        }
      } else {
        console.log("Ejercicio sin metadatos, usando valores por defecto");
      }
      
      // Crear el ejercicio con el formato necesario
      return {
        id: generateId(),
        type: exerciseTypeToUse,
        difficulty: difficultyToUse,
        problem: ex.problem,
        solution: ex.solution,
        hint: ex.hint || "Intenta factorizar identificando el tipo de expresión.",
        points: difficultyToUse === DifficultyLevel.EASY ? 1 : 
                difficultyToUse === DifficultyLevel.MEDIUM ? 2 : 3
      };
    });
    
    console.log("Ejercicios formateados:", formattedExercises);
    
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

    return (
      <div className="exercise-container">
        <div className="exercise-header">
          <div className="exercise-type">{getExerciseTypeName(currentExercise.type)}</div>
          <div className="exercise-difficulty">{currentExercise.difficulty}</div>
          <div className="exercise-points">Valor: {currentExercise.points} {currentExercise.points === 1 ? 'moneda' : 'monedas'}</div>
        </div>

        {currentExercise.context && (
          <div className="exercise-context">{currentExercise.context}</div>
        )}

        <div className="exercise-problem">
          <h3>Factoriza la siguiente expresión:</h3>
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
              title="Mostrar/ocultar guía de LaTeX"
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
      case ExerciseType.BASIC:
        return 'Factor común';
      case ExerciseType.COMPLETE_SQUARE:
        return 'Trinomio cuadrado perfecto';
      case ExerciseType.DIFFERENCE_SQUARES:
        return 'Diferencia de cuadrados';
      case ExerciseType.PERFECT_CUBE:
        return 'Cubo perfecto';
      case ExerciseType.BUSINESS_APPLICATION:
        return 'Aplicación empresarial';
      case ExerciseType.PDF_BASED:
        return 'Basado en PDF';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="factorization-exercises-container">
      <h2 className="factorization-exercises-title">Ejercicios de Factorización</h2>
      
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
            <option value={ExerciseType.BASIC}>Factor común</option>
            <option value={ExerciseType.COMPLETE_SQUARE}>Trinomio cuadrado perfecto</option>
            <option value={ExerciseType.DIFFERENCE_SQUARES}>Diferencia de cuadrados</option>
            <option value={ExerciseType.PERFECT_CUBE}>Cubo perfecto</option>
            <option value={ExerciseType.BUSINESS_APPLICATION}>Aplicación empresarial</option>
            <option value={ExerciseType.PDF_BASED}>Basado en PDF</option>
          </select>
        </div>
        
        <div className="filter-group">
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
      </div>

      <div className="exercise-controls">
        <button 
          className="ai-toggle-button" 
          onClick={() => setShowAiGenerator(!showAiGenerator)}
        >
          {showAiGenerator ? 'Ocultar generador IA' : 'Mostrar generador IA'}
        </button>
      </div>
      
      {showAiGenerator && (
        <AIExerciseGenerator 
          topic="factorization"
          onExercisesGenerated={handleAIExercisesGenerated}
        />
      )}

      {renderCurrentExercise()}
    </div>
  );
};

export default FactorizationExercises; 