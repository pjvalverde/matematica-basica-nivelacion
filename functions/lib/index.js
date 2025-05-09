"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepseekProxy = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const axios_1 = require("axios");
admin.initializeApp();
const corsHandler = cors({ origin: true });
// La clave API se obtiene de variables de entorno de Firebase
// Se debe configurar con: firebase functions:config:set deepseek.apikey="tu-clave-api"
// o usar secretos: firebase functions:secrets:set DEEPSEEK_API_KEY "tu-clave-api"
const getApiKey = () => {
    // Usar la variable DEEPSEEK_API_KEY para producción
    const apiKeyFromSecret = process.env.DEEPSEEK_API_KEY;
    if (apiKeyFromSecret) {
        return apiKeyFromSecret;
    }
    // Fallback a una clave codificada para desarrollo (no recomendado para producción)
    try {
        // La misma clave codificada que en el cliente
        const encoded = 'c2stYmQ4OTRlMWIzNTZmNDA5NDk3MTNiNWRhYzY0MjQ0Y2M=';
        return Buffer.from(encoded, 'base64').toString('ascii');
    }
    catch (error) {
        console.error('Error decodificando API key:', error);
        throw new functions.https.HttpsError('internal', 'Error al obtener la clave API');
    }
};
// Función proxy para llamar a la API de DeepSeek
exports.deepseekProxy = functions.https.onRequest((request, response) => {
    corsHandler(request, response, async () => {
        // Solo permitir solicitudes POST
        if (request.method !== 'POST') {
            response.status(405).send('Método no permitido');
            return;
        }
        try {
            const { topic, difficulty, type } = request.body;
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
            // URL de la API de DeepSeek
            const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
            console.log('Enviando solicitud a DeepSeek:', prompt);
            const deepseekResponse = await axios_1.default.post(apiUrl, {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "Eres un asistente especializado en generar ejercicios de matemáticas. Formatea las expresiones matemáticas usando la sintaxis de LaTeX." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                response_format: { type: "json_object" }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getApiKey()}`
                },
                timeout: 15000 // Tiempo de espera de 15 segundos
            });
            // Procesar la respuesta de DeepSeek
            if (deepseekResponse.data && deepseekResponse.data.choices && deepseekResponse.data.choices[0].message.content) {
                const content = deepseekResponse.data.choices[0].message.content;
                console.log("Respuesta de DeepSeek:", content);
                try {
                    // Intentamos extraer el array JSON de la respuesta
                    let exercises;
                    const match = content.match(/\[.*\]/s);
                    if (match) {
                        exercises = JSON.parse(match[0]);
                    }
                    else if (content.includes('{') && content.includes('}')) {
                        // Si no hay corchetes pero hay llaves, intentamos parsear como JSON
                        const jsonObj = JSON.parse(content);
                        if (jsonObj.exercises) {
                            exercises = jsonObj.exercises;
                        }
                        else {
                            // Intentamos convertir en array si no es un array ya
                            exercises = Array.isArray(jsonObj) ? jsonObj : [jsonObj];
                        }
                    }
                    if (exercises && exercises.length > 0) {
                        response.status(200).json({ success: true, exercises });
                        return;
                    }
                    else {
                        throw new Error('No se pudieron extraer ejercicios de la respuesta');
                    }
                }
                catch (parseError) {
                    console.error("Error al parsear la respuesta:", parseError);
                    throw parseError;
                }
            }
            else {
                throw new Error('Respuesta inválida de DeepSeek');
            }
        }
        catch (error) {
            console.error('Error en la función proxy:', error);
            response.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                message: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    });
});
//# sourceMappingURL=index.js.map