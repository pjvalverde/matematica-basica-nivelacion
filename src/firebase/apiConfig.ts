// Configuración para la API de DeepSeek usando Firebase Cloud Functions

import axios from 'axios';

// Función para generar ejercicios usando DeepSeek AI a través de Firebase Functions
export const generateAIExercises = async (
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
) => {
  try {
    // Usamos la función de Firebase para evitar problemas de CORS
    const functionUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001/math-basis/us-central1/deepseekProxy' 
      : 'https://us-central1-math-basis.cloudfunctions.net/deepseekProxy';
    
    console.log(`Llamando a la función de Firebase: ${functionUrl}`);
    
    const response = await axios.post(
      functionUrl,
      {
        topic,
        difficulty,
        type
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000 // Ampliamos el tiempo de espera a 20 segundos
      }
    );
    
    if (response.data && response.data.success && response.data.exercises) {
      console.log("Ejercicios recibidos:", response.data.exercises);
      return response.data.exercises;
    } else {
      console.error("Respuesta inválida de la función:", response.data);
      throw new Error('No se recibieron ejercicios válidos');
    }
  } catch (error) {
    console.error("Error al llamar a la función de Firebase:", error);
    // En caso de error, devolvemos ejercicios predefinidos según el tipo
    return generateBackupExercises(topic, difficulty, type);
  }
};

// Genera ejercicios predefinidos en caso de que falle la API
function generateBackupExercises(
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
): any[] {
  if (topic === 'factorization') {
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
  } else {
    // Fracciones racionales
    if (type && type.includes('suma')) {
      return [
        {
          problem: "\\frac{2}{x} + \\frac{3}{x}",
          solution: "\\frac{5}{x}",
          hint: "Suma directamente los numeradores por tener el mismo denominador"
        },
        {
          problem: "\\frac{1}{x+1} + \\frac{2}{x+2}",
          solution: "\\frac{(x+2) + 2(x+1)}{(x+1)(x+2)} = \\frac{3x+4}{(x+1)(x+2)}",
          hint: "Encuentra el mínimo común múltiplo de los denominadores"
        },
        {
          problem: "\\frac{x}{x-1} + \\frac{1}{x+1}",
          solution: "\\frac{x(x+1) + (x-1)}{(x-1)(x+1)} = \\frac{x^2+x+x-1}{(x-1)(x+1)} = \\frac{x^2+2x-1}{(x-1)(x+1)}",
          hint: "Usa el denominador común (x-1)(x+1)"
        }
      ];
    } else if (type && type.includes('simplifica')) {
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
          problem: "\\frac{x^3-8}{x-2}",
          solution: "x^2+2x+4",
          hint: "Factoriza el numerador como (x-2)(x^2+2x+4)"
        }
      ];
    } else {
      return [
        {
          problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
          solution: "\\frac{x}{x-1}",
          hint: "Cancela los factores comunes (x+1)"
        },
        {
          problem: "\\frac{x^2-4}{x+2} \\div \\frac{x-2}{x+1}",
          solution: "\\frac{(x-2)(x+1)}{(x+2)(x+1)} = \\frac{x-2}{x+2}",
          hint: "Para dividir fracciones, multiplica por el recíproco de la segunda"
        },
        {
          problem: "\\frac{2x}{x^2-1}",
          solution: "\\frac{2x}{(x-1)(x+1)}",
          hint: "Factoriza el denominador como (x-1)(x+1)"
        }
      ];
    }
  }
}; 