import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from '../utils/MathRenderer';
import './FactorizationExercises.css'; // Reutilizamos el mismo CSS
import { addCoinsToUser, getUserProfile } from '../firebase/userService';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

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
      solution: "\\frac{3(x+1)-(x-2)}{(x-2)(x+1)}",
      hint: "Encuentra el denominador común y resta las fracciones",
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
      solution: "\\frac{2x+2}{(x-1)(x+1)}",
      hint: "Recuerda que x²-1 = (x-1)(x+1) y encuentra el denominador común",
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
    const filteredExercises = allExercises.filter(ex => ex.difficulty === difficulty);
    
    // Seleccionar un ejercicio aleatorio
    if (filteredExercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredExercises.length);
      setCurrentExercise(filteredExercises[randomIndex]);
      setUserAnswer('');
      setShowSolution(false);
      setIsCorrect(null);
    } else {
      setError("No hay ejercicios disponibles con los criterios seleccionados");
      setCurrentExercise(null);
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
      <h4>Guía para escribir respuestas</h4>
      <ul>
        <li>Exponentes: <code>x^2</code> para x²</li>
        <li>Fracciones: <code>x^2/(x-1)</code> para x²/(x-1)</li>
        <li>Raíz cuadrada: <code>\sqrt{'{'}x{'}'}</code> para √x</li>
        <li>Productos: <code>2x</code> o <code>2*x</code> para 2x</li>
        <li>Paréntesis: Use <code>(</code> y <code>)</code> para agrupar expresiones</li>
        <li>No es necesario escribir el coeficiente 1, por ejemplo: <code>x</code> en lugar de <code>1x</code></li>
      </ul>
    </div>
  );

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
        
        <button className="generate-button" onClick={generateNewExercise}>
          Generar ejercicio
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {renderCurrentExercise()}
    </div>
  );
};

export default CombinedProblems; 