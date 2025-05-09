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
    console.log('Parámetros:', { topic, difficulty, type });
    
    // Agregamos un timestamp para evitar cachés
    const requestData = {
      topic,
      difficulty,
      type,
      timestamp: new Date().getTime()
    };
    
    const response = await axios.post(
      functionUrl,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // Ampliamos el tiempo de espera a 30 segundos
      }
    );
    
    console.log('Respuesta completa:', response);
    
    if (response.data && response.data.success && response.data.exercises) {
      console.log("Ejercicios recibidos:", response.data.exercises);
      
      // MODIFICACIÓN CRÍTICA: Forzar explícitamente la dificultad y tipo seleccionados
      // Esto garantiza que los ejercicios siempre respeten lo que el usuario seleccionó
      const forcedExercises = response.data.exercises.map((exercise: any) => ({
        ...exercise,
        // Sobreescribir completamente los metadatos con los seleccionados por el usuario
        metadata: {
          generatedByAI: true,
          difficulty: difficulty, // FORZAR la dificultad que seleccionó el usuario
          type: type || "",       // FORZAR el tipo que seleccionó el usuario
          forcedByApi: true       // Añadir indicador para debugging
        }
      }));
      
      console.log("Ejercicios con dificultad y tipo FORZADOS:", forcedExercises);
      console.log("FORZANDO dificultad:", difficulty, " y tipo:", type);
      
      return forcedExercises;
    } else {
      console.error("Respuesta inválida de la función:", response.data);
      throw new Error('No se recibieron ejercicios válidos');
    }
  } catch (error) {
    console.error("Error al llamar a la función de Firebase:", error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error de Axios:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    
    // En caso de error, devolvemos ejercicios predefinidos según el tipo
    const backupExercises = generateBackupExercises(topic, difficulty, type);
    
    // Añadir metadatos a los ejercicios de respaldo
    return backupExercises.map(exercise => ({
      ...exercise,
      metadata: {
        generatedByAI: false,
        difficulty: difficulty, // FORZAR la dificultad que seleccionó el usuario
        type: type || "",       // FORZAR el tipo que seleccionó el usuario
        forcedByApi: true,      // Añadir indicador para debugging
        isBackup: true
      }
    }));
  }
};

// Genera ejercicios predefinidos en caso de que falle la API
function generateBackupExercises(
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
): any[] {
  console.log('Generando ejercicios de respaldo para:', { topic, difficulty, type });
  
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