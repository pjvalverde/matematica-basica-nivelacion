import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { addCoinsToUser } from '../firebase/userService';
import { BlockMath, InlineMath } from '../utils/MathRenderer';
import './EquationsExercises.css';

// Enumeración para los tipos de ejercicios de ecuaciones
enum ExerciseType {
  LINEAR = 'LINEAR',
  QUADRATIC = 'QUADRATIC',
  SYSTEM_2X2 = 'SYSTEM_2X2',
  SYSTEM_3X3 = 'SYSTEM_3X3'
}

// Enumeración para los niveles de dificultad
enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

interface Exercise {
  id: string;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  problem: string;
  solution: string;
  hint?: string;
  context?: string;
  points: number;
}

interface EquationsExercisesProps {
  user: User | null;
}

// Función para generar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
    case ExerciseType.LINEAR:
      if (difficulty === DifficultyLevel.EASY) {
        const scenarios = [
          { a: 2, b: 6, problem: '2x = 6', solution: 'x = 3' },
          { a: 3, b: 12, problem: '3x = 12', solution: 'x = 4' },
          { a: 5, b: 15, problem: '5x = 15', solution: 'x = 3' },
          { a: 4, b: 16, problem: '4x = 16', solution: 'x = 4' },
          { a: 6, b: 18, problem: '6x = 18', solution: 'x = 3' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = `Divide ambos lados de la ecuación por ${scenario.a}.`;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const scenarios = [
          { problem: '2x + 3 = 11', solution: 'x = 4', hint: 'Resta 3 de ambos lados y luego divide por 2.' },
          { problem: '3x - 5 = 7', solution: 'x = 4', hint: 'Suma 5 a ambos lados y luego divide por 3.' },
          { problem: '4x + 7 = 19', solution: 'x = 3', hint: 'Resta 7 de ambos lados y luego divide por 4.' },
          { problem: '5x - 2 = 13', solution: 'x = 3', hint: 'Suma 2 a ambos lados y luego divide por 5.' },
          { problem: '2x + 8 = 14', solution: 'x = 3', hint: 'Resta 8 de ambos lados y luego divide por 2.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else {
        const scenarios = [
          { problem: '3x + 2 = 2x + 7', solution: 'x = 5', hint: 'Agrupa las variables en un lado y las constantes en el otro.' },
          { problem: '4x - 1 = 2x + 9', solution: 'x = 5', hint: 'Resta 2x de ambos lados y suma 1 a ambos lados.' },
          { problem: '5x + 3 = 3x + 11', solution: 'x = 4', hint: 'Resta 3x de ambos lados y resta 3 de ambos lados.' },
          { problem: '2x - 4 = x + 2', solution: 'x = 6', hint: 'Resta x de ambos lados y suma 4 a ambos lados.' },
          { problem: '6x - 5 = 4x + 3', solution: 'x = 4', hint: 'Resta 4x de ambos lados y suma 5 a ambos lados.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      }
      break;

    case ExerciseType.QUADRATIC:
      if (difficulty === DifficultyLevel.EASY) {
        const scenarios = [
          { problem: 'x^2 = 9', solution: 'x = ±3', hint: 'Toma la raíz cuadrada de ambos lados.' },
          { problem: 'x^2 = 16', solution: 'x = ±4', hint: 'Toma la raíz cuadrada de ambos lados.' },
          { problem: 'x^2 = 25', solution: 'x = ±5', hint: 'Toma la raíz cuadrada de ambos lados.' },
          { problem: 'x^2 = 4', solution: 'x = ±2', hint: 'Toma la raíz cuadrada de ambos lados.' },
          { problem: 'x^2 = 36', solution: 'x = ±6', hint: 'Toma la raíz cuadrada de ambos lados.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const scenarios = [
          { problem: 'x^2 - 5x + 6 = 0', solution: 'x = 2 o x = 3', hint: 'Busca dos números que multiplicados den 6 y sumados den 5.' },
          { problem: 'x^2 - 7x + 12 = 0', solution: 'x = 3 o x = 4', hint: 'Busca dos números que multiplicados den 12 y sumados den 7.' },
          { problem: 'x^2 - 6x + 8 = 0', solution: 'x = 2 o x = 4', hint: 'Busca dos números que multiplicados den 8 y sumados den 6.' },
          { problem: 'x^2 - 8x + 15 = 0', solution: 'x = 3 o x = 5', hint: 'Busca dos números que multiplicados den 15 y sumados den 8.' },
          { problem: 'x^2 - 9x + 20 = 0', solution: 'x = 4 o x = 5', hint: 'Busca dos números que multiplicados den 20 y sumados den 9.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else {
        const scenarios = [
          { problem: '2x^2 + 3x - 2 = 0', solution: 'x = 0.5 o x = -2', hint: 'Usa la fórmula cuadrática.' },
          { problem: 'x^2 + 4x + 3 = 0', solution: 'x = -1 o x = -3', hint: 'Factoriza o usa la fórmula cuadrática.' },
          { problem: '3x^2 - 5x - 2 = 0', solution: 'x = 2 o x = -0.33', hint: 'Usa la fórmula cuadrática.' },
          { problem: 'x^2 + 2x - 3 = 0', solution: 'x = 1 o x = -3', hint: 'Factoriza (x+3)(x-1) = 0.' },
          { problem: '2x^2 - 7x + 3 = 0', solution: 'x = 3 o x = 0.5', hint: 'Factoriza o usa la fórmula cuadrática.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      }
      break;

    case ExerciseType.SYSTEM_2X2:
      if (difficulty === DifficultyLevel.EASY) {
        const scenarios = [
          { problem: '\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Suma las dos ecuaciones para eliminar y.' },
          { problem: '\\begin{cases} x + y = 7 \\\\ x - y = 3 \\end{cases}', solution: 'x = 5, y = 2', hint: 'Suma las dos ecuaciones para eliminar y.' },
          { problem: '\\begin{cases} x + y = 6 \\\\ x - y = 2 \\end{cases}', solution: 'x = 4, y = 2', hint: 'Suma las dos ecuaciones para eliminar y.' },
          { problem: '\\begin{cases} x + y = 8 \\\\ x - y = 4 \\end{cases}', solution: 'x = 6, y = 2', hint: 'Suma las dos ecuaciones para eliminar y.' },
          { problem: '\\begin{cases} x + y = 9 \\\\ x - y = 1 \\end{cases}', solution: 'x = 5, y = 4', hint: 'Suma las dos ecuaciones para eliminar y.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const scenarios = [
          { problem: '\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}', solution: 'x = 3, y = 1', hint: 'Suma las ecuaciones para eliminar y.' },
          { problem: '\\begin{cases} 3x + 2y = 11 \\\\ x - y = 1 \\end{cases}', solution: 'x = 3, y = 1', hint: 'Despeja x de la segunda ecuación y sustituye.' },
          { problem: '\\begin{cases} x + 3y = 10 \\\\ 2x - y = 3 \\end{cases}', solution: 'x = 4, y = 2', hint: 'Multiplica la segunda ecuación por 3 y suma.' },
          { problem: '\\begin{cases} 2x + 3y = 12 \\\\ x + y = 5 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Despeja x de la segunda ecuación y sustituye.' },
          { problem: '\\begin{cases} 3x - y = 7 \\\\ x + 2y = 6 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Multiplica la primera ecuación por 2 y suma.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else {
        const scenarios = [
          { problem: '\\begin{cases} 3x + 2y = 13 \\\\ 2x - 3y = 0 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Multiplica para eliminar una variable.' },
          { problem: '\\begin{cases} 4x - 3y = 5 \\\\ 2x + y = 7 \\end{cases}', solution: 'x = 2, y = 3', hint: 'Multiplica la segunda ecuación por 3 y suma.' },
          { problem: '\\begin{cases} 5x + 2y = 19 \\\\ 3x - 4y = 1 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Multiplica por coeficientes apropiados.' },
          { problem: '\\begin{cases} 2x + 5y = 16 \\\\ 3x - 2y = 5 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Usa eliminación con múltiplos apropiados.' },
          { problem: '\\begin{cases} 4x + 3y = 18 \\\\ 2x - y = 4 \\end{cases}', solution: 'x = 3, y = 2', hint: 'Multiplica la segunda ecuación y elimina y.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      }
      break;

    case ExerciseType.SYSTEM_3X3:
      if (difficulty === DifficultyLevel.EASY) {
        const scenarios = [
          { problem: '\\begin{cases} x + y + z = 6 \\\\ x = 2 \\\\ y = 1 \\end{cases}', solution: 'x = 2, y = 1, z = 3', hint: 'Sustituye los valores conocidos.' },
          { problem: '\\begin{cases} x + y + z = 7 \\\\ z = 3 \\\\ x = y \\end{cases}', solution: 'x = 2, y = 2, z = 3', hint: 'Usa la tercera ecuación para simplificar.' },
          { problem: '\\begin{cases} x + y + z = 8 \\\\ x - y = 0 \\\\ z = 2 \\end{cases}', solution: 'x = 3, y = 3, z = 2', hint: 'x = y, entonces x + x + 2 = 8.' },
          { problem: '\\begin{cases} x + y + z = 9 \\\\ x = 3 \\\\ y = z \\end{cases}', solution: 'x = 3, y = 3, z = 3', hint: 'Si y = z, entonces 3 + 2y = 9.' },
          { problem: '\\begin{cases} x + y + z = 5 \\\\ x = 1 \\\\ y = 2 \\end{cases}', solution: 'x = 1, y = 2, z = 2', hint: 'Sustituye directamente los valores conocidos.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else if (difficulty === DifficultyLevel.MEDIUM) {
        const scenarios = [
          { problem: '\\begin{cases} x + y + z = 6 \\\\ 2x - y = 1 \\\\ x + z = 4 \\end{cases}', solution: 'x = 2, y = 3, z = 1', hint: 'Despeja z de la tercera ecuación.' },
          { problem: '\\begin{cases} x + y + z = 8 \\\\ x - y = 2 \\\\ y + z = 5 \\end{cases}', solution: 'x = 3, y = 1, z = 4', hint: 'Usa las dos últimas ecuaciones.' },
          { problem: '\\begin{cases} x + 2y + z = 10 \\\\ x - y = 1 \\\\ z = 3 \\end{cases}', solution: 'x = 3, y = 2, z = 3', hint: 'Sustituye z = 3 en la primera ecuación.' },
          { problem: '\\begin{cases} 2x + y + z = 9 \\\\ x + y = 4 \\\\ z = 1 \\end{cases}', solution: 'x = 2, y = 2, z = 1', hint: 'Sustituye z = 1 y resuelve el sistema 2x2.' },
          { problem: '\\begin{cases} x + y + 2z = 11 \\\\ x - y = 1 \\\\ z = 3 \\end{cases}', solution: 'x = 3, y = 2, z = 3', hint: 'Sustituye z = 3 y resuelve para x e y.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      } else {
        const scenarios = [
          { problem: '\\begin{cases} 2x + y - z = 3 \\\\ x - y + 2z = 4 \\\\ 3x + 2y + z = 11 \\end{cases}', solution: 'x = 2, y = 1, z = 2', hint: 'Usa eliminación gaussiana.' },
          { problem: '\\begin{cases} x + 2y + z = 8 \\\\ 2x - y + 3z = 9 \\\\ x + y - z = 2 \\end{cases}', solution: 'x = 3, y = 1, z = 2', hint: 'Elimina sistemáticamente las variables.' },
          { problem: '\\begin{cases} 3x + y + 2z = 11 \\\\ x - 2y + z = 2 \\\\ 2x + 3y - z = 7 \\end{cases}', solution: 'x = 2, y = 1, z = 2', hint: 'Usa el método de eliminación.' },
          { problem: '\\begin{cases} x + y + 3z = 10 \\\\ 2x - y + z = 5 \\\\ x + 2y - z = 3 \\end{cases}', solution: 'x = 2, y = 1, z = 2', hint: 'Suma y resta ecuaciones estratégicamente.' },
          { problem: '\\begin{cases} 2x + 3y + z = 13 \\\\ x - y + 2z = 6 \\\\ 3x + y - z = 8 \\end{cases}', solution: 'x = 2, y = 3, z = 1', hint: 'Resuelve paso a paso eliminando variables.' }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        exercise.problem = scenario.problem;
        exercise.solution = scenario.solution;
        exercise.hint = scenario.hint;
      }
      break;
  }

  return exercise;
};

const EquationsExercises: React.FC<EquationsExercisesProps> = ({ user }) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>(ExerciseType.LINEAR);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [exerciseHistory, setExerciseHistory] = useState<Exercise[]>([]);

  useEffect(() => {
    generateNewExercise();
  }, [selectedType, selectedDifficulty]);

  const generateNewExercise = () => {
    const newExercise = generateExercise(selectedType, selectedDifficulty);
    setCurrentExercise(newExercise);
    setUserAnswer('');
    setShowSolution(false);
    setFeedback('');
  };

  const checkAnswer = async () => {
    if (!currentExercise || !userAnswer.trim()) {
      setFeedback('Por favor, ingresa una respuesta.');
      return;
    }

    // Normalizar respuesta del usuario y solución esperada
    const normalizeAnswer = (answer: string): string => {
      return answer
        .toLowerCase()
        .replace(/\s+/g, '') // Eliminar espacios
        .replace(/x=/g, '') // Eliminar "x=" al principio
        .replace(/=/g, '') // Eliminar signos de igual
        .replace(/±/g, '+-') // Convertir ± a +-
        .replace(/\+\-/g, '+-') // Normalizar +- 
        .replace(/o/g, ',') // Convertir "o" a ","
        .replace(/y=/g, ',y=') // Separar variables con comas
        .replace(/z=/g, ',z=') // Separar variables con comas
        .replace(/,+/g, ',') // Eliminar comas múltiples
        .replace(/^,|,$/g, '') // Eliminar comas al inicio/final
        .trim();
    };

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedSolution = normalizeAnswer(currentExercise.solution);

    // Verificar si las respuestas coinciden exactamente o con variaciones comunes
    const checkVariations = (user: string, solution: string): boolean => {
      // Verificación exacta
      if (user === solution) return true;
      
      // Para sistemas de ecuaciones, verificar si las variables están en orden diferente
      if (user.includes(',') && solution.includes(',')) {
        const userParts = user.split(',').sort();
        const solutionParts = solution.split(',').sort();
        if (userParts.length === solutionParts.length) {
          return userParts.every((part, index) => part === solutionParts[index]);
        }
      }
      
      // Para ecuaciones cuadráticas, verificar orden de soluciones
      if ((user.includes('+-') || user.includes(',')) && 
          (solution.includes('+-') || solution.includes(','))) {
        const userNums = user.replace(/[xy=]/g, '').split(/[,+-]/).filter(n => n).sort();
        const solNums = solution.replace(/[xy=]/g, '').split(/[,+-]/).filter(n => n).sort();
        if (userNums.length === solNums.length) {
          return userNums.every((num, index) => Math.abs(parseFloat(num) - parseFloat(solNums[index])) < 0.01);
        }
      }
      
      return false;
    };

    const isCorrect = checkVariations(normalizedUserAnswer, normalizedSolution);
    
    if (isCorrect) {
      setFeedback('¡Correcto! 🎉');
      setScore(score + currentExercise.points);
      
      // Agregar puntos al usuario en Firebase
      if (user) {
        try {
          await addCoinsToUser(user.uid, currentExercise.points);
        } catch (error) {
          console.error('Error al agregar puntos:', error);
        }
      }
      
      // Agregar al historial
      setExerciseHistory([...exerciseHistory, currentExercise]);
      
      // Generar nuevo ejercicio automáticamente después de 2 segundos
      setTimeout(() => {
        generateNewExercise();
      }, 2000);
    } else {
      setFeedback('Incorrecto. Intenta de nuevo o mira la solución.');
      setShowSolution(true);
    }
  };

  const getTypeDescription = (type: ExerciseType): string => {
    switch (type) {
      case ExerciseType.LINEAR:
        return 'Ecuaciones Lineales';
      case ExerciseType.QUADRATIC:
        return 'Ecuaciones Cuadráticas';
      case ExerciseType.SYSTEM_2X2:
        return 'Sistemas 2x2';
      case ExerciseType.SYSTEM_3X3:
        return 'Sistemas 3x3';
      default:
        return 'Ecuaciones';
    }
  };

  const getDifficultyDescription = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return 'Fácil';
      case DifficultyLevel.MEDIUM:
        return 'Intermedio';
      case DifficultyLevel.HARD:
        return 'Difícil';
      default:
        return 'Fácil';
    }
  };

  return (
    <div className="equations-container">
      <div className="equations-header">
        <h1>📊 Ejercicios de Ecuaciones</h1>
        <p>Resuelve ecuaciones lineales, cuadráticas y sistemas de ecuaciones</p>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label htmlFor="exercise-type">Tipo de ejercicio:</label>
          <select
            id="exercise-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ExerciseType)}
            className="control-select"
          >
            <option value={ExerciseType.LINEAR}>Ecuaciones Lineales</option>
            <option value={ExerciseType.QUADRATIC}>Ecuaciones Cuadráticas</option>
            <option value={ExerciseType.SYSTEM_2X2}>Sistemas 2x2</option>
            <option value={ExerciseType.SYSTEM_3X3}>Sistemas 3x3</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="difficulty-level">Nivel de dificultad:</label>
          <select
            id="difficulty-level"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
            className="control-select"
          >
            <option value={DifficultyLevel.EASY}>Fácil (1 punto)</option>
            <option value={DifficultyLevel.MEDIUM}>Intermedio (2 puntos)</option>
            <option value={DifficultyLevel.HARD}>Difícil (3 puntos)</option>
          </select>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-label">Puntuación actual:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Tipo actual:</span>
          <span className="stat-value">{getTypeDescription(selectedType)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Dificultad:</span>
          <span className="stat-value">{getDifficultyDescription(selectedDifficulty)}</span>
        </div>
      </div>

      {currentExercise && (
        <div className="exercise-card">
          <div className="problem-section">
            <h3>📝 Resuelve la siguiente ecuación:</h3>
            <div className="math-display">
              <BlockMath math={currentExercise.problem} />
            </div>
          </div>
          
          {currentExercise.hint && (
            <div className="hint-section">
              <h4>💡 Pista:</h4>
              <p>{currentExercise.hint}</p>
            </div>
          )}
          
          <div className="answer-section">
            <label htmlFor="user-answer">Tu respuesta:</label>
            <input
              id="user-answer"
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Ejemplo: x = 3, y = 2"
              className="answer-input"
            />
            <div className="button-group">
              <button onClick={checkAnswer} className="check-button">
                Verificar Respuesta
              </button>
              <button onClick={generateNewExercise} className="new-exercise-button">
                Nuevo Ejercicio
              </button>
            </div>
          </div>
          
          {feedback && (
            <div className={`feedback-section ${feedback.includes('Correcto') ? 'correct' : 'incorrect'}`}>
              <p>{feedback}</p>
            </div>
          )}
          
          {showSolution && (
            <div className="solution-section">
              <h4>✅ Solución:</h4>
              <div className="math-display">
                <BlockMath math={currentExercise.solution} />
              </div>
            </div>
          )}
        </div>
      )}

      {exerciseHistory.length > 0 && (
        <div className="history-section">
          <h3>Ejercicios completados: {exerciseHistory.length}</h3>
          <div className="history-stats">
            <span>Puntos ganados: {exerciseHistory.reduce((total, ex) => total + ex.points, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquationsExercises; 