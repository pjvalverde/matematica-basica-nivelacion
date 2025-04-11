import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ExerciseDisplay from './components/ExerciseDisplay';
import ExerciseGenerator from './utils/ExerciseGenerator';

function App() {
  const [exerciseType, setExerciseType] = useState<'notables' | 'operations'>('notables');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [usePredefined, setUsePredefined] = useState<boolean>(false);
  const [predefinedExercises, setPredefinedExercises] = useState<{exercise: string, solution: string}[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);

  useEffect(() => {
    // Cargar ejercicios predefinidos al cambiar el tipo
    if (usePredefined) {
      const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
      setPredefinedExercises(exercises);
      setCurrentExerciseIndex(0);
      
      if (exercises.length > 0) {
        setCurrentExercise(exercises[0].exercise);
        setSolution(exercises[0].solution);
      }
    }
  }, [exerciseType, usePredefined]);

  const generateNewExercise = () => {
    setShowSolution(false);
    setUserAnswer('');
    setIsCorrect(null);
    
    if (usePredefined) {
      // Avanzar al siguiente ejercicio predefinido
      const nextIndex = (currentExerciseIndex + 1) % predefinedExercises.length;
      setCurrentExerciseIndex(nextIndex);
      setCurrentExercise(predefinedExercises[nextIndex].exercise);
      setSolution(predefinedExercises[nextIndex].solution);
    } else {
      // Generar ejercicio aleatorio
      const { exercise, solution } = ExerciseGenerator.generate(exerciseType, difficulty);
      setCurrentExercise(exercise);
      setSolution(solution);
    }
  };

  const checkAnswer = () => {
    // Simple check - in a real app, this would be more sophisticated
    const userAnswerClean = userAnswer.replace(/\s+/g, '');
    const solutionClean = solution.replace(/\s+/g, '');
    
    setIsCorrect(userAnswerClean === solutionClean);
  };

  const revealSolution = () => {
    setShowSolution(true);
  };

  const toggleExerciseMode = () => {
    setUsePredefined(!usePredefined);
    setShowSolution(false);
    setUserAnswer('');
    setIsCorrect(null);
    
    if (!usePredefined) {
      // Cambiar a ejercicios predefinidos
      const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
      setPredefinedExercises(exercises);
      setCurrentExerciseIndex(0);
      
      if (exercises.length > 0) {
        setCurrentExercise(exercises[0].exercise);
        setSolution(exercises[0].solution);
      }
    } else {
      // Volver a ejercicios aleatorios
      setCurrentExercise('');
      setSolution('');
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="exercise-card">
          <h2 className="card-title">
            Ejercicios de Matemática Básica
          </h2>
          
          <div className="form-section">
            <div className="exercise-mode-toggle">
              <button
                className={`mode-button ${usePredefined ? 'mode-button-active' : ''}`}
                onClick={toggleExerciseMode}
              >
                {usePredefined ? 'Usando Hoja de Ejercicios' : 'Usar Hoja de Ejercicios'}
              </button>
            </div>
            
            <div className="form-row">
              <div className="form-column">
                <label className="form-label">
                  Tipo de Ejercicio
                </label>
                <select 
                  className="form-select"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value as 'notables' | 'operations')}
                >
                  <option value="notables">Productos Notables</option>
                  <option value="operations">Orden de las Operaciones</option>
                </select>
              </div>
              
              {!usePredefined && (
                <div className="form-column">
                  <label className="form-label">
                    Dificultad
                  </label>
                  <select 
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Medio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              )}
            </div>
            
            <button 
              className="generate-button"
              onClick={generateNewExercise}
            >
              {usePredefined ? 'Siguiente Ejercicio' : 'Generar Nuevo Ejercicio'}
            </button>
          </div>
          
          {currentExercise && (
            <ExerciseDisplay 
              exercise={currentExercise}
              solution={solution}
              showSolution={showSolution}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              isCorrect={isCorrect}
              onCheck={checkAnswer}
              onReveal={revealSolution}
            />
          )}
          
          {!currentExercise && (
            <div className="empty-state">
              <p className="empty-state-text">
                Haz clic en {usePredefined ? '"Siguiente Ejercicio"' : '"Generar Nuevo Ejercicio"'} para comenzar.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
