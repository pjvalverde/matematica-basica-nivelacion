import React, { useEffect, FC } from 'react';
import ExerciseDisplay from './ExerciseDisplay'; //Corrected Import
import ExerciseGenerator from '../utils/ExerciseGenerator';

interface ExerciseCardProps {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  exerciseType: 'notables' | 'operations';
  setExerciseType: (type: 'notables' | 'operations') => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  exercise: string;
  currentExercise: string;
  setCurrentExercise: (exercise: string) => void;
  solution: string;
  setSolution: (solution: string) => void;
  showSolution: boolean;
  setShowSolution: (show: boolean) => void;
  isCorrect: boolean | null;
  setIsCorrect: (correct: boolean | null) => void;
  usePredefined: boolean;
  setUsePredefined: (usePredefined: boolean) => void;
  predefinedExercises: { exercise: string; solution: string }[];
  setPredefinedExercises: (exercises: { exercise: string; solution: string }[]) => void;
  currentExerciseIndex: number;
  setCurrentExerciseIndex: (index: number) => void;
  toggleExerciseMode: () => void;
  generateNewExercise: () => void;
  onCheck: () => void;
  onReveal: () => void;//Added prop
}


const ExerciseCard: FC<ExerciseCardProps> = ({
  userAnswer,
  setUserAnswer,
  exerciseType,
  setExerciseType,
  difficulty,
  setDifficulty,
  currentExercise,
  setCurrentExercise,
  solution,
  setSolution,
  showSolution,
  setShowSolution,
  isCorrect,
  setIsCorrect,
  usePredefined,
  setUsePredefined,
  predefinedExercises,
  setPredefinedExercises,
  currentExerciseIndex,
  setCurrentExerciseIndex,
  toggleExerciseMode,
  generateNewExercise,
  exercise,
  onCheck,
  onReveal
}) => {
  const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
  useEffect(() => {
    // Load predefined exercises when the type changes
    if (usePredefined) {
        setPredefinedExercises(exercises);
        setCurrentExerciseIndex(0);
    }
  }, [exerciseType, usePredefined, setPredefinedExercises, setCurrentExerciseIndex]);
    useEffect(() => {
        if (usePredefined) {
            const exercises = ExerciseGenerator.getPredefinedExercises(exerciseType);
            setPredefinedExercises(exercises);
            setCurrentExerciseIndex(0);
    
            if (exercises.length > 0) {
                setCurrentExercise(exercises[0].exercise);
                setSolution(exercises[0].solution);
            }
        }}, [exerciseType, usePredefined, setPredefinedExercises, setCurrentExercise, setSolution, setCurrentExerciseIndex]);

  return (
    <div className="exercise-card">
      <h2 className="card-title">Ejercicios de Matemática Básica</h2>
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
            <label className="form-label">Tipo de Ejercicio</label>
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
              <label className="form-label">Dificultad</label>
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

        <button className="generate-button" onClick={generateNewExercise}>
          {usePredefined ? 'Siguiente Ejercicio' : 'Generar Nuevo Ejercicio'}
        </button>
      </div>

      {currentExercise && (
        <ExerciseDisplay
          exercise={currentExercise}
          solution={solution}
          showSolution={showSolution}
          setUserAnswer={setUserAnswer}
          isCorrect={isCorrect}
          onCheck={onCheck}
          onReveal={onReveal} // Corrected Prop name
          userAnswer={userAnswer}
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
  );
};

export default ExerciseCard;