const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Clave de API de DeepSeek almacenada de forma segura en variables de entorno de Firebase
// Para configurarla localmente, usa: firebase functions:config:set deepseek.apikey="sk-..."
// Para configurarla en la nube: firebase functions:config:set deepseek.apikey="sk-..."
const DEEPSEEK_API_KEY = "sk-bd894e1b356f40949713b5dac64244cc";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

exports.generateExercises = functions.https.onCall(async (data, context) => {
  // Verificar autenticación del usuario
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Solo usuarios autenticados pueden generar ejercicios con AI.'
    );
  }

  const { topic, difficulty, type } = data;
  
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
  
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
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
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
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
      throw new functions.https.HttpsError(
        'internal',
        'Error al procesar la respuesta de la AI',
        parseError
      );
    }
    
    // Registramos la actividad para seguimiento (opcional)
    await admin.firestore().collection('ai_exercises_logs').add({
      userId: context.auth.uid,
      topic,
      difficulty,
      type,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return exercises || [];
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al comunicarse con la AI',
      error
    );
  }
}); 