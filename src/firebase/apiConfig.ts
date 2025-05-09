// Configuración para la API de DeepSeek
// La clave API está ofuscada para mayor seguridad

import axios from 'axios';

// La clave API se ofusca para no exponerla directamente
// Esto no es seguridad perfecta, pero dificulta la extracción casual de la clave
const decodeApiKey = () => {
  const encoded = 'c2stYmQ4OTRlMWIzNTZmNDA5NDk3MTNiNWRhYzY0MjQ0Y2M=';
  return atob(encoded);
};

// Función para generar ejercicios usando DeepSeek AI
export const generateAIExercises = async (
  topic: 'factorization' | 'rationalfractions', 
  difficulty: 'easy' | 'medium' | 'hard',
  type?: string
) => {
  try {
    let prompt = "";
    
    if (topic === 'factorization') {
      prompt = `Genera 3 ejercicios sencillos de factorización algebraica de dificultad ${difficulty}`;
      if (type) {
        prompt += ` del tipo ${type}`;
      }
      prompt += `. Para cada ejercicio, proporciona solo la expresión a factorizar y su solución. 
      El formato debe ser un array JSON así: 
      [{"problem": "expresión", "solution": "solución", "hint": "pista"}]`;
    } 
    else if (topic === 'rationalfractions') {
      prompt = `Genera 3 ejercicios sencillos de fracciones algebraicas racionales de dificultad ${difficulty}`;
      if (type) {
        prompt += ` que involucren ${type}`;
      }
      prompt += `. Para cada ejercicio, proporciona solo la expresión a simplificar/resolver y su solución.
      El formato debe ser un array JSON así: 
      [{"problem": "expresión", "solution": "solución", "hint": "pista"}]`;
    }
    
    // Intentamos con múltiples proxies CORS en caso de fallo
    const proxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    
    const deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    // Generamos ejemplos predefinidos en caso de fallo de la API
    const backupExercises = generateBackupExercises(topic, difficulty, type);
    
    // Intentamos con cada proxy hasta que uno funcione
    let lastError = null;
    for (const proxy of proxies) {
      try {
        console.log(`Intentando con proxy: ${proxy}`);
        const response = await axios.post(
          `${proxy}${encodeURIComponent(deepseekApiUrl)}`,
          {
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "Eres un asistente especializado en generar ejercicios de matemáticas. Formatea las expresiones matemáticas usando la sintaxis de LaTeX." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${decodeApiKey()}`
            },
            timeout: 15000 // Tiempo de espera de 15 segundos
          }
        );
        
        let exercises;
        
        // Intentamos parsear la respuesta
        if (response.data && response.data.choices && response.data.choices[0].message.content) {
          const content = response.data.choices[0].message.content;
          console.log("Contenido de la respuesta:", content);
          
          try {
            // Intentamos extraer el array JSON de la respuesta
            const match = content.match(/\[.*\]/s);
            if (match) {
              exercises = JSON.parse(match[0]);
            } else if (content.includes('{') && content.includes('}')) {
              // Si no hay corchetes pero hay llaves, intentamos parsear como JSON
              const jsonObj = JSON.parse(content);
              if (jsonObj.exercises) {
                exercises = jsonObj.exercises;
              } else {
                // Intentamos convertir en array si no es un array ya
                exercises = Array.isArray(jsonObj) ? jsonObj : [jsonObj];
              }
            }
            
            if (exercises && exercises.length > 0) {
              return exercises;
            }
          } catch (parseError) {
            console.error("Error al parsear la respuesta:", parseError);
            lastError = parseError;
          }
        }
      } catch (proxyError) {
        console.error(`Error con el proxy ${proxy}:`, proxyError);
        lastError = proxyError;
        // Continuamos con el siguiente proxy
      }
    }
    
    // Si llegamos aquí, todos los proxies fallaron o no pudimos obtener una respuesta válida
    console.log("Todos los proxies fallaron, usando ejercicios de respaldo");
    return backupExercises;
    
  } catch (error) {
    console.error("Error general al llamar a la API de DeepSeek:", error);
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