import React, { useState } from 'react';
import { generateAIExercises } from '../firebase/apiConfig';
import './FactorizationExercises.css'; // Reutilizamos el mismo CSS

interface AIExerciseGeneratorProps {
  topic: 'factorization' | 'rationalfractions';
  onExercisesGenerated: (exercises: any[]) => void;
}

const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ topic, onExercisesGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [exerciseType, setExerciseType] = useState<string>('');

  // Opciones de tipo según el tema
  const typeOptions = topic === 'factorization' 
    ? [
        { value: '', label: 'Cualquier tipo' },
        { value: 'factor común', label: 'Factor común' },
        { value: 'diferencia de cuadrados', label: 'Diferencia de cuadrados' },
        { value: 'trinomio cuadrado perfecto', label: 'Trinomio cuadrado perfecto' },
        { value: 'trinomio de la forma ax²+bx+c', label: 'Trinomio general' }
      ]
    : [
        { value: '', label: 'Cualquier tipo' },
        { value: 'simplificación', label: 'Simplificación' },
        { value: 'suma y resta', label: 'Suma y resta' },
        { value: 'multiplicación y división', label: 'Multiplicación y división' },
        { value: 'operaciones combinadas', label: 'Operaciones combinadas' }
      ];

  const generateExercises = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const exercises = await generateAIExercises(
        topic, 
        difficulty,
        exerciseType
      );
      
      if (exercises && Array.isArray(exercises)) {
        onExercisesGenerated(exercises);
      } else {
        setError('No se pudieron generar ejercicios. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al generar ejercicios:', error);
      setError('Ha ocurrido un error al comunicarse con la IA. Por favor, inténtalo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-exercise-generator">
      <h3>Generar ejercicios con Inteligencia Artificial</h3>
      <p>
        Usa la IA para generar ejercicios personalizados según tus necesidades.
      </p>
      
      <div className="generator-controls">
        <div className="control-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select 
            id="difficulty" 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="exercise-type">Tipo de ejercicio:</label>
          <select 
            id="exercise-type" 
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="generate-button"
          onClick={generateExercises}
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : 'Generar con IA'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIExerciseGenerator; 