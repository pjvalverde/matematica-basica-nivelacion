import React, { useState } from 'react';
import { generateAIExercises } from '../firebase/apiConfig';
import './FactorizationExercises.css'; // Reutilizamos el mismo CSS

interface AIExerciseGeneratorProps {
  topic: 'factorization' | 'rationalfractions';
  onExercisesGenerated: (exercises: any[]) => void;
}

// Ejemplos predefinidos para mostrar inmediatamente
const getLocalExercises = (topic: 'factorization' | 'rationalfractions', difficulty: 'easy' | 'medium' | 'hard', type: string) => {
  // Ejercicios de factorización
  if (topic === 'factorization') {
    if (difficulty === 'easy') {
      return [
        {
          problem: "x^2 + 5x + 6",
          solution: "(x + 2)(x + 3)",
          hint: "Busca dos números que multiplicados den 6 y sumados den 5"
        },
        {
          problem: "x^2 - 9",
          solution: "(x + 3)(x - 3)",
          hint: "Es una diferencia de cuadrados"
        },
        {
          problem: "2x^2 + 6x",
          solution: "2x(x + 3)",
          hint: "Factoriza usando el factor común"
        }
      ];
    } else if (difficulty === 'medium') {
      return [
        {
          problem: "x^2 - 6x + 9",
          solution: "(x - 3)^2",
          hint: "Es un trinomio cuadrado perfecto"
        },
        {
          problem: "4x^2 - 25",
          solution: "(2x - 5)(2x + 5)",
          hint: "Es una diferencia de cuadrados"
        },
        {
          problem: "3x^2 + 6x - 24",
          solution: "3(x + 4)(x - 2)",
          hint: "Saca factor común y factoriza el trinomio resultante"
        }
      ];
    } else { // hard
      return [
        {
          problem: "x^3 - 8",
          solution: "(x - 2)(x^2 + 2x + 4)",
          hint: "Es una diferencia de cubos: a³ - b³ = (a - b)(a² + ab + b²)"
        },
        {
          problem: "x^4 - 16",
          solution: "(x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)",
          hint: "Primero factoriza como diferencia de cuadrados, luego sigue factorizando"
        },
        {
          problem: "2x^3 - 54x",
          solution: "2x(x^2 - 27) = 2x(x - 3√3)(x + 3√3)",
          hint: "Saca factor común y luego factoriza la diferencia de cuadrados"
        }
      ];
    }
  } 
  // Ejercicios de fracciones algebraicas
  else {
    // Ejercicios de suma y resta
    if (type && type.includes('suma')) {
      if (difficulty === 'easy') {
        return [
          {
            problem: "\\frac{2}{x} + \\frac{3}{x}",
            solution: "\\frac{5}{x}",
            hint: "Suma directamente los numeradores por tener el mismo denominador"
          },
          {
            problem: "\\frac{3}{y} + \\frac{2}{y}",
            solution: "\\frac{5}{y}",
            hint: "Como los denominadores son iguales, suma los numeradores"
          },
          {
            problem: "\\frac{x}{2} - \\frac{x}{4}",
            solution: "\\frac{x}{4}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          }
        ];
      } else if (difficulty === 'medium') {
        return [
          {
            problem: "\\frac{1}{x+1} + \\frac{2}{x+2}",
            solution: "\\frac{(x+2) + 2(x+1)}{(x+1)(x+2)} = \\frac{3x+4}{(x+1)(x+2)}",
            hint: "Encuentra el denominador común"
          },
          {
            problem: "\\frac{3}{x-2} - \\frac{1}{x+1}",
            solution: "\\frac{3(x+1) - (x-2)}{(x-2)(x+1)} = \\frac{3x+3-x+2}{(x-2)(x+1)} = \\frac{2x+5}{(x-2)(x+1)}",
            hint: "Encuentra el denominador común (x-2)(x+1)"
          },
          {
            problem: "\\frac{2}{x} + \\frac{1}{x^2}",
            solution: "\\frac{2x + 1}{x^2}",
            hint: "Convierte la primera fracción para tener denominador x²"
          }
        ];
      } else { // hard
        return [
          {
            problem: "\\frac{x}{x-1} + \\frac{1}{x+1}",
            solution: "\\frac{x(x+1) + (x-1)}{(x-1)(x+1)} = \\frac{x^2+x+x-1}{(x-1)(x+1)} = \\frac{x^2+2x-1}{(x-1)(x+1)}",
            hint: "Encuentra el denominador común (x-1)(x+1)"
          },
          {
            problem: "\\frac{1}{x-1} - \\frac{1}{(x-1)^2}",
            solution: "\\frac{x-1 - 1}{(x-1)^2} = \\frac{x-2}{(x-1)^2}",
            hint: "Convierte la primera fracción para tener denominador (x-1)²"
          },
          {
            problem: "\\frac{1}{x^2-1} + \\frac{1}{x-1}",
            solution: "\\frac{1}{(x-1)(x+1)} + \\frac{1}{x-1} = \\frac{1+x+1}{(x-1)(x+1)} = \\frac{x+2}{(x-1)(x+1)}",
            hint: "Factoriza x²-1 como (x-1)(x+1)"
          }
        ];
      }
    } 
    // Ejercicios de simplificación
    else if (type && type.includes('simplifica')) {
      if (difficulty === 'easy') {
        return [
          {
            problem: "\\frac{x^2-1}{x-1}",
            solution: "x+1",
            hint: "Factoriza el numerador como (x-1)(x+1)"
          },
          {
            problem: "\\frac{x^2+3x+2}{x+2}",
            solution: "x+1",
            hint: "Factoriza el numerador como (x+1)(x+2)"
          },
          {
            problem: "\\frac{3x^2}{3x}",
            solution: "x",
            hint: "Simplifica dividiendo numerador y denominador por 3x"
          }
        ];
      } else if (difficulty === 'medium') {
        return [
          {
            problem: "\\frac{x^2-4}{x^2-4x+4}",
            solution: "\\frac{(x-2)(x+2)}{(x-2)^2} = \\frac{x+2}{x-2}",
            hint: "Factoriza numerador y denominador"
          },
          {
            problem: "\\frac{x^3-x^2}{x^2-x}",
            solution: "\\frac{x^2(x-1)}{x(x-1)} = x",
            hint: "Factoriza numerador y denominador para encontrar factores comunes"
          },
          {
            problem: "\\frac{x^2-9}{x-3}",
            solution: "x+3",
            hint: "Factoriza el numerador como (x-3)(x+3)"
          }
        ];
      } else { // hard
        return [
          {
            problem: "\\frac{x^3-8}{x-2}",
            solution: "x^2+2x+4",
            hint: "Factoriza el numerador como (x-2)(x^2+2x+4)"
          },
          {
            problem: "\\frac{x^3-1}{x^2-1}",
            solution: "\\frac{(x-1)(x^2+x+1)}{(x-1)(x+1)} = \\frac{x^2+x+1}{x+1}",
            hint: "Usa las fórmulas de factorización para cubos y cuadrados"
          },
          {
            problem: "\\frac{x^4-16}{x^2-4}",
            solution: "\\frac{(x^2-4)(x^2+4)}{(x-2)(x+2)} = \\frac{(x-2)(x+2)(x^2+4)}{(x-2)(x+2)} = x^2+4",
            hint: "Factoriza paso a paso tanto el numerador como el denominador"
          }
        ];
      }
    } 
    // Ejercicios de multiplicación y división
    else if (type && type.includes('multi')) {
      if (difficulty === 'easy') {
        return [
          {
            problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
            solution: "\\frac{x}{x-1}",
            hint: "Cancela los factores comunes (x+1)"
          },
          {
            problem: "\\frac{2x}{3} \\cdot \\frac{6}{x^2}",
            solution: "\\frac{4}{x}",
            hint: "Multiplica numeradores entre sí y denominadores entre sí, luego simplifica"
          },
          {
            problem: "\\frac{x-1}{x+1} \\cdot \\frac{x+1}{x}",
            solution: "\\frac{x-1}{x}",
            hint: "Cancela los factores comunes (x+1)"
          }
        ];
      } else if (difficulty === 'medium') {
        return [
          {
            problem: "\\frac{x^2-4}{x+2} \\div \\frac{x-2}{x+1}",
            solution: "\\frac{(x-2)(x+2)}{(x+2)} \\cdot \\frac{x+1}{x-2} = \\frac{(x+2)(x+1)}{(x+2)(x-2)} = \\frac{x+1}{x-2}",
            hint: "Para dividir fracciones, multiplica por el recíproco de la segunda"
          },
          {
            problem: "\\frac{x^2-1}{x} \\cdot \\frac{x}{x^2+1}",
            solution: "\\frac{x^2-1}{x^2+1} = \\frac{(x-1)(x+1)}{x^2+1}",
            hint: "Multiplica directamente y factoriza el numerador si es posible"
          },
          {
            problem: "\\frac{x^2}{x-1} \\div \\frac{x}{x^2-1}",
            solution: "\\frac{x^2}{x-1} \\cdot \\frac{x^2-1}{x} = \\frac{x^2(x-1)(x+1)}{x(x-1)} = \\frac{x(x+1)}{1} = x(x+1)",
            hint: "Recuerda que dividir por una fracción es multiplicar por su recíproco"
          }
        ];
      } else { // hard
        return [
          {
            problem: "\\frac{x^2-4}{x+2} \\cdot \\frac{x+2}{x^2+4x+4}",
            solution: "\\frac{(x-2)(x+2)}{(x+2)(x+2)^2} = \\frac{x-2}{(x+2)^2}",
            hint: "Factoriza donde sea posible y cancela factores comunes"
          },
          {
            problem: "\\frac{x^3-1}{x-1} \\div \\frac{x^2+x+1}{x+1}",
            solution: "\\frac{(x-1)(x^2+x+1)}{x-1} \\cdot \\frac{x+1}{x^2+x+1} = \\frac{x+1}{1} = x+1",
            hint: "Factoriza x³-1 como (x-1)(x²+x+1) y luego simplifica"
          },
          {
            problem: "\\frac{x^2-25}{x^2-4} \\cdot \\frac{x-2}{x-5}",
            solution: "\\frac{(x-5)(x+5)}{(x-2)(x+2)} \\cdot \\frac{x-2}{x-5} = \\frac{(x+5)}{(x+2)}",
            hint: "Factoriza las diferencias de cuadrados y cancela factores comunes"
          }
        ];
      }
    } 
    // Ejercicios generales o complejos
    else {
      if (difficulty === 'easy') {
        return [
          {
            problem: "\\frac{2x}{x^2-1}",
            solution: "\\frac{2x}{(x-1)(x+1)}",
            hint: "Factoriza el denominador como (x-1)(x+1)"
          },
          {
            problem: "\\frac{x+1}{x-1} - \\frac{1}{x-1}",
            solution: "\\frac{x+1-1}{x-1} = \\frac{x}{x-1}",
            hint: "Como los denominadores son iguales, resta los numeradores"
          },
          {
            problem: "\\frac{1}{x-2} + \\frac{3}{x-2}",
            solution: "\\frac{1+3}{x-2} = \\frac{4}{x-2}",
            hint: "Suma los numeradores ya que los denominadores son iguales"
          }
        ];
      } else if (difficulty === 'medium') {
        return [
          {
            problem: "\\frac{x}{x-1} - \\frac{1}{x}",
            solution: "\\frac{x^2 - (x-1)}{x(x-1)} = \\frac{x^2-x+1}{x(x-1)}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          },
          {
            problem: "\\frac{x^2+x}{x} \\cdot \\frac{1}{x+1}",
            solution: "\\frac{x(x+1)}{x(x+1)} = 1",
            hint: "Simplifica sacando factor común en el numerador"
          },
          {
            problem: "\\frac{x-2}{x+2} \\div \\frac{x^2-4}{x-1}",
            solution: "\\frac{x-2}{x+2} \\cdot \\frac{x-1}{(x-2)(x+2)} = \\frac{(x-1)}{(x+2)^2}",
            hint: "Recuerda que x²-4 = (x-2)(x+2)"
          }
        ];
      } else { // hard
        return [
          {
            problem: "\\frac{1}{x-1} + \\frac{1}{x+1} + \\frac{2}{x^2-1}",
            solution: "\\frac{(x+1) + (x-1) + 2}{(x-1)(x+1)} = \\frac{2x+2}{(x-1)(x+1)} = \\frac{2(x+1)}{(x-1)(x+1)} = \\frac{2}{x-1}",
            hint: "Recuerda que x²-1 = (x-1)(x+1) y encuentra el denominador común"
          },
          {
            problem: "\\frac{x^2-9}{x-3} \\cdot \\frac{x^2-4}{x^2+6x+9}",
            solution: "\\frac{(x-3)(x+3)}{x-3} \\cdot \\frac{(x-2)(x+2)}{(x+3)^2} = \\frac{(x+3)(x-2)(x+2)}{(x+3)^2} = \\frac{(x-2)(x+2)}{x+3}",
            hint: "Factoriza donde sea posible y cancela factores comunes"
          },
          {
            problem: "\\frac{x^2-6x+9}{x^3-27} \\div \\frac{x-3}{x^2+3x+9}",
            solution: "\\frac{(x-3)^2}{(x-3)(x^2+3x+9)} \\cdot \\frac{x^2+3x+9}{x-3} = \\frac{(x-3)}{1} = x-3",
            hint: "Factoriza x³-27 como (x-3)(x²+3x+9)"
          }
        ];
      }
    }
  }
  
  // Si no se encontró ninguna coincidencia específica
  return [
    {
      problem: "x^2 + 5x + 6",
      solution: "(x + 2)(x + 3)",
      hint: "Busca dos números que multiplicados den 6 y sumados den 5"
    },
    {
      problem: "x^2 - 9",
      solution: "(x + 3)(x - 3)",
      hint: "Es una diferencia de cuadrados"
    },
    {
      problem: "2x^2 + 6x",
      solution: "2x(x + 3)",
      hint: "Factoriza usando el factor común"
    }
  ];
};

const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ topic, onExercisesGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [useAI, setUseAI] = useState<boolean>(true); // Estado para controlar si usar IA o ejercicios locales

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
      if (useAI) {
        // Usar la API de DeepSeek a través de Firebase Functions
        const exercises = await generateAIExercises(
          topic, 
          difficulty,
          exerciseType
        );
        
        if (exercises && Array.isArray(exercises)) {
          onExercisesGenerated(exercises);
        } else {
          setError('No se pudieron generar ejercicios. Usando ejercicios predefinidos.');
          const localExercises = getLocalExercises(topic, difficulty, exerciseType);
          onExercisesGenerated(localExercises);
        }
      } else {
        // Usar ejemplos locales predefinidos sin llamar a la API
        const localExercises = getLocalExercises(topic, difficulty, exerciseType);
        
        setTimeout(() => {
          onExercisesGenerated(localExercises);
        }, 300); // Pequeña demora para simular procesamiento
      }
    } catch (error) {
      console.error('Error al generar ejercicios:', error);
      setError('Ha ocurrido un error. Mostrando ejercicios predefinidos.');
      
      // En caso de error, usar ejercicios predefinidos
      const localExercises = getLocalExercises(topic, difficulty, exerciseType);
      onExercisesGenerated(localExercises);
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
        
        <div className="control-group checkbox-control">
          <label>
            <input 
              type="checkbox" 
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Usar IA para generar (Plan Blaze)
          </label>
        </div>
        
        <button 
          className="generate-button"
          onClick={generateExercises}
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : useAI ? 'Generar con IA' : 'Generar ejercicios'}
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