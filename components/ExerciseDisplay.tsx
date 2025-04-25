import React from 'react';
import { InlineMath, BlockMath } from '../utils/MathRenderer';
import './ExerciseDisplay.css';

interface ExerciseDisplayProps {
  exercise: string;
  solution: string;
  showSolution: boolean;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isCorrect: boolean | null;
  onCheck: () => void;
  onReveal: () => void;
}

const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({
  exercise,
  solution,
  showSolution,
  userAnswer,
  setUserAnswer,
  isCorrect,
  onCheck,
  onReveal
}) => {
  return (
    <div className="exercise-container">
      <div className="exercise-section">
        <h3 className="exercise-title">Ejercicio:</h3>
        <div className="exercise-display">
          <BlockMath math={exercise} />
        </div>
      </div>
      
      <div className="exercise-section">
        <label htmlFor="answer" className="answer-label">
          Tu Respuesta:
        </label>
        <input
          type="text"
          id="answer"
          className={`answer-input ${
            isCorrect === null 
              ? 'answer-input-default' 
              : isCorrect 
                ? 'answer-input-correct' 
                : 'answer-input-incorrect'
          }`}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Escribe tu respuesta aquí"
        />
        
        <div className="input-help">
          Para escribir exponentes usa el símbolo ^ (por ejemplo: x^2 para x²). No uses espacios entre términos.
        </div>
        
        {isCorrect !== null && (
          <p className={`feedback-message ${isCorrect ? 'feedback-message-correct' : 'feedback-message-incorrect'}`}>
            {isCorrect 
              ? '¡Correcto! ¡Muy bien!' 
              : 'Incorrecto. Inténtalo de nuevo o revisa la solución.'}
          </p>
        )}
      </div>
      
      <div className="button-container">
        <button
          className="check-button"
          onClick={onCheck}
        >
          Verificar Respuesta
        </button>
        
        <button
          className={`solution-button ${showSolution ? 'solution-button-disabled' : ''}`}
          onClick={onReveal}
          disabled={showSolution}
        >
          {showSolution ? 'Solución Mostrada' : 'Mostrar Solución'}
        </button>
      </div>
      
      {showSolution && (
        <div className="solution-container">
          <h4 className="solution-title">Solución:</h4>
          <div className="solution-display">
            <BlockMath math={solution} />
          </div>
          <div className="solution-note">
            <p>
              Recuerda practicar este tipo de ejercicios para mejorar tu comprensión de los conceptos matemáticos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay; 