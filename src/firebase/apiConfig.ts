// Configuración para la API de DeepSeek usando Firebase Cloud Functions

import axios from 'axios';

// Logs de debugging mejorados
const logDebug = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔌 API_CONFIG: ${message}`);
  if (data) console.log(data);
};

const logError = (message: string, error: any) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ API_ERROR: ${message}`, error);
};

// NUEVO: Guardar las últimas selecciones del usuario
let lastUserSelections = {
  difficulty: '',
  type: '',
  timestamp: 0
};

// Función para generar ejercicios usando DeepSeek AI a través de Firebase Functions
export const generateAIExercises = async (
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
) => {
  logDebug(`⭐ INICIANDO LLAMADA A API para ${topic}, dificultad=${difficulty}, tipo=${type || "no especificado"}`);
  
  try {
    // NUEVO: Almacenar selecciones del usuario
    lastUserSelections = {
      difficulty,
      type: type || '',
      timestamp: Date.now()
    };
    
    // Guardar en localStorage inmediatamente para recuperación en caso de error
    localStorage.setItem('last_api_request', JSON.stringify(lastUserSelections));
    
    logDebug(`🔐 API REQUEST - SELECCIONES DEL USUARIO: Dificultad=${difficulty}, Tipo=${type}`);
    
    // Usamos la función de Firebase para evitar problemas de CORS
    const functionUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5001/math-basis/us-central1/deepseekProxy' 
      : 'https://us-central1-math-basis.cloudfunctions.net/deepseekProxy';
    
    logDebug(`Llamando a la función de Firebase: ${functionUrl}`);
    
    // Agregamos un timestamp para evitar cachés
    const requestData = {
      topic,
      difficulty,
      type,
      timestamp: new Date().getTime(),
      forceSelections: true, // NUEVO: Indicar que debe forzar estas selecciones
      requestId: Math.random().toString(36).substring(2, 15) // ID único para esta solicitud
    };
    
    logDebug("📤 Enviando solicitud con datos:", requestData);
    
    const response = await axios.post(
      functionUrl,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Force-Difficulty': difficulty, // NUEVO: Indicador explícito en headers
          'X-Force-Type': type || '', // NUEVO: Indicador explícito en headers
          'X-Request-ID': requestData.requestId // NUEVO: ID de seguimiento
        },
        timeout: 30000 // 30 segundos máximo
      }
    );
    
    logDebug(`📥 Respuesta recibida con status: ${response.status}`);
    
    if (response.data && response.data.success && response.data.exercises) {
      logDebug(`✅ Ejercicios recibidos: ${response.data.exercises.length}`);
      
      // SOLUCIÓN EXTREMA: Ignorar completamente los metadatos del API
      // y sobreescribirlos con lo que el usuario seleccionó
      const forcedExercises = response.data.exercises.map((exercise: any, index: number) => {
        logDebug(`Procesando ejercicio #${index+1}`);
        
        // Comprobar si los contenidos son válidos
        if (!exercise.problem || !exercise.solution) {
          logError(`Ejercicio #${index+1} inválido recibido del API:`, exercise);
          // Crear un ejercicio de respaldo
          return {
            problem: "x^2 + 5x + 6",
            solution: "(x + 2)(x + 3)",
            hint: "Busca dos números que multiplicados den 6 y sumados den 5",
            metadata: {
              generatedByAI: true,
              difficulty: difficulty, // FORZAR la dificultad que seleccionó el usuario
              type: type || "",       // FORZAR el tipo que seleccionó el usuario
              forcedByApi: true,       // Añadir indicador para debugging
              isRepaired: true
            },
            // NUEVO: Datos adicionales para garantizar recuperación
            originalUserSelections: {
              difficulty,
              type: type || '',
              timestamp: Date.now()
            }
          };
        }
        
        return {
          ...exercise,
          // IGNORAR COMPLETAMENTE cualquier metadato que venga de la API
          metadata: {
            generatedByAI: true,
            difficulty: difficulty, // FORZAR la dificultad que seleccionó el usuario
            type: type || "",       // FORZAR el tipo que seleccionó el usuario
            forcedByApi: true,      // Añadir indicador para debugging
            timestamp: Date.now()   // Timestamp para debugging
          },
          // NUEVO: Datos adicionales para garantizar recuperación
          originalUserSelections: {
            difficulty,
            type: type || '',
            timestamp: Date.now()
          }
        };
      });
      
      logDebug("🔐 Ejercicios con dificultad y tipo FORZADOS:", forcedExercises.length);
      
      // NUEVO: Guardar respuesta para debugging/recuperación
      localStorage.setItem('last_api_response', JSON.stringify({
        timestamp: new Date().toString(),
        requestDifficulty: difficulty,
        requestType: type,
        exercises: forcedExercises
      }));
      
      logDebug("✅✅✅ API EJECUTADA CON ÉXITO - RETORNANDO EJERCICIOS ✅✅✅");
      return forcedExercises;
    } else {
      logError("Respuesta inválida de la función:", response.data);
      throw new Error('No se recibieron ejercicios válidos');
    }
  } catch (error) {
    logError("Error al llamar a la función de Firebase:", error);
    
    if (axios.isAxiosError(error)) {
      logError('Detalles del error de Axios:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    
    // NUEVO: Guardar error para debugging
    localStorage.setItem('last_api_error', JSON.stringify({
      timestamp: new Date().toString(),
      error: error instanceof Error ? error.message : 'Error desconocido',
      userSelections: lastUserSelections
    }));
    
    // En caso de error, devolvemos ejercicios predefinidos según el tipo
    logDebug("⚠️ Generando ejercicios de respaldo debido al error");
    
    const backupExercises = generateBackupExercises(topic, difficulty, type);
    
    // Añadir metadatos a los ejercicios de respaldo
    return backupExercises.map(exercise => ({
      ...exercise,
      metadata: {
        generatedByAI: false,
        difficulty: difficulty, // FORZAR la dificultad que seleccionó el usuario
        type: type || "",       // FORZAR el tipo que seleccionó el usuario
        forcedByApi: true,      // Añadir indicador para debugging
        isBackup: true,
        timestamp: Date.now()   // Timestamp para debugging
      },
      // NUEVO: Datos adicionales para garantizar recuperación
      originalUserSelections: {
        difficulty,
        type: type || '',
        timestamp: Date.now()
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