// Configuración para la API de DeepSeek usando Firebase Cloud Functions

import axios from 'axios';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { functions } from './firebaseConfig';

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
    
    // Determinar el entorno y construir la URL adecuada
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    // Usamos dos métodos para llamar a la función: directo por HTTP y a través de Firebase SDK
    // para aumentar la probabilidad de éxito
    let exercises;
    let errorFromHttp = null;
    
    // Método 1: Llamada directa HTTP a la función
    try {
      const functionUrl = isLocalhost 
        ? 'http://localhost:5001/math-basis/us-central1/deepseekProxy' 
        : 'https://us-central1-math-basis.cloudfunctions.net/deepseekProxy';
      
      logDebug(`Método 1: Llamando directamente a la función de Firebase: ${functionUrl}`);
      
      // Agregamos un timestamp para evitar cachés
      const requestData = {
        topic,
        difficulty,
        type,
        timestamp: Date.now(),
        forceSelections: true,
        requestId: Math.random().toString(36).substring(2, 15)
      };
      
      logDebug("📤 Método 1: Enviando solicitud HTTP con datos:", requestData);
      
      const response = await axios.post(
        functionUrl,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Force-Difficulty': difficulty,
            'X-Force-Type': type || '',
            'X-Request-ID': requestData.requestId,
            'X-Client-Source': 'web-app-direct'
          },
          timeout: 30000 // 30 segundos máximo
        }
      );
      
      logDebug(`📥 Método 1: Respuesta HTTP recibida con status: ${response.status}`);
      
      if (response.data && response.data.success && response.data.exercises) {
        logDebug(`✅ Método 1: Ejercicios recibidos: ${response.data.exercises.length}`);
        exercises = processExercises(response.data.exercises, difficulty, type);
        
        // Guardar respuesta para debugging/recuperación
        localStorage.setItem('last_api_response_method1', JSON.stringify({
          timestamp: new Date().toString(),
          requestDifficulty: difficulty,
          requestType: type,
          exercises: exercises
        }));
        
        return exercises;
      }
    } catch (httpError) {
      errorFromHttp = httpError;
      logError("❌ Método 1: Error en llamada HTTP directa:", httpError);
      
      if (axios.isAxiosError(httpError)) {
        logError('Detalles del error de Axios:', {
          message: httpError.message,
          status: httpError.response?.status,
          data: httpError.response?.data,
          headers: httpError.response?.headers
        });
      }
      
      // Continuamos con el método 2
      logDebug("⚠️ Intentando con el método 2 (Firebase SDK)...");
    }
    
    // Método 2: Usar Firebase SDK
    try {
      logDebug("Método 2: Llamando a la función usando Firebase SDK");
      
      // Obtener referencia a la función
      const deepseekProxyFn = httpsCallable(functions, 'deepseekProxy');
      
      // Llamar a la función
      const result = await deepseekProxyFn({
        topic,
        difficulty,
        type,
        timestamp: Date.now(),
        requestId: Math.random().toString(36).substring(2, 15),
        method: "sdk_call"
      });
      
      logDebug("📥 Método 2: Respuesta SDK recibida:", result);
      
      if (result.data) {
        const data = result.data as any;
        if (data.success && data.exercises) {
          logDebug(`✅ Método 2: Ejercicios recibidos: ${data.exercises.length}`);
          exercises = processExercises(data.exercises, difficulty, type);
          
          // Guardar respuesta para debugging/recuperación
          localStorage.setItem('last_api_response_method2', JSON.stringify({
            timestamp: new Date().toString(),
            requestDifficulty: difficulty,
            requestType: type,
            exercises: exercises
          }));
          
          return exercises;
        }
      }
      
      // Si llegamos aquí, ninguno de los métodos funcionó
      throw new Error("Ambos métodos de llamada a la API fallaron");
      
    } catch (sdkError) {
      logError("❌ Método 2: Error en llamada SDK:", sdkError);
      
      // Ambos métodos fallaron, lanzamos el error original
      throw errorFromHttp || sdkError;
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
    return processExercises(backupExercises, difficulty, type, true);
  }
};

// Procesar ejercicios con metadatos consistentes
function processExercises(exercises: any[], difficulty: string, type?: string, isBackup = false) {
  return exercises.map(exercise => ({
    ...exercise,
    metadata: {
      generatedByAI: !isBackup,
      difficulty: difficulty,
      type: type || "",
      forcedByApi: true,
      isBackup: isBackup,
      timestamp: Date.now()
    },
    originalUserSelections: {
      difficulty,
      type: type || '',
      timestamp: Date.now()
    }
  }));
}

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
          problem: "\\frac{x^2-4}{x^2-4x+4}",
          solution: "\\frac{(x+2)(x-2)}{(x-2)^2} = \\frac{x+2}{x-2}",
          hint: "Factoriza numerador y denominador"
        }
      ];
    } else {
      return [
        {
          problem: "\\frac{x^2-1}{x-1}",
          solution: "x+1",
          hint: "Factoriza el numerador como (x-1)(x+1)"
        },
        {
          problem: "\\frac{1}{x-1} - \\frac{1}{x+1}",
          solution: "\\frac{(x+1) - (x-1)}{(x-1)(x+1)} = \\frac{2}{(x-1)(x+1)}",
          hint: "Encuentra el denominador común y resta"
        },
        {
          problem: "\\frac{x}{x^2-1}",
          solution: "\\frac{x}{(x-1)(x+1)}",
          hint: "Factoriza el denominador"
        }
      ];
    }
  }
} 