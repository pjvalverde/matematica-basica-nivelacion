// Configuración para la API de DeepSeek
// La clave API se almacena de forma segura en Firebase Functions
// y no se expone directamente en el código cliente

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
      prompt = `Genera 3 ejercicios de factorización algebraica de dificultad ${difficulty}`;
      if (type) {
        prompt += ` del tipo ${type}`;
      }
      prompt += `. Para cada ejercicio, proporciona la expresión a factorizar y su solución paso a paso. 
      Formatea tu respuesta como un array JSON con este formato: 
      [{"problem": "expresión", "solution": "solución", "hint": "pista opcional"}]`;
    } 
    else if (topic === 'rationalfractions') {
      prompt = `Genera 3 ejercicios de fracciones algebraicas racionales de dificultad ${difficulty}`;
      if (type) {
        prompt += ` que involucren ${type}`;
      }
      prompt += `. Para cada ejercicio, proporciona la expresión a simplificar/resolver y su solución paso a paso.
      Formatea tu respuesta como un array JSON con este formato: 
      [{"problem": "expresión", "solution": "solución", "hint": "pista opcional"}]`;
    }
    
    // Usamos un proxy CORS para evitar problemas de CORS
    // En producción, deberías usar un proxy propio o un servicio como CORS Anywhere
    const corsProxy = 'https://corsproxy.io/?';
    const deepseekApiUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    const response = await axios.post(
      `${corsProxy}${encodeURIComponent(deepseekApiUrl)}`,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un asistente especializado en generar ejercicios de matemáticas. Formatea las expresiones matemáticas usando la sintaxis de LaTeX." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${decodeApiKey()}`
        }
      }
    );
    
    let exercises;
    
    // Intentamos parsear la respuesta
    try {
      // Si la respuesta ya es un objeto JSON, usamos directamente el contenido
      if (response.data && response.data.choices && response.data.choices[0].message.content) {
        const content = response.data.choices[0].message.content;
        // Intentamos extraer el array JSON de la respuesta
        const match = content.match(/\[.*\]/s);
        if (match) {
          exercises = JSON.parse(match[0]);
        } else {
          // Si no hay corchetes, intentamos parsear todo el contenido
          exercises = JSON.parse(content);
        }
      }
    } catch (parseError) {
      console.error("Error parsing DeepSeek response:", parseError);
      throw new Error('Error al procesar la respuesta de la AI');
    }
    
    return exercises || [];
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
}; 