"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepseekProxy = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const axios_1 = require("axios");
admin.initializeApp();
// Configurar CORS para permitir solicitudes desde cualquier origen
const corsHandler = cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});
// La clave API se obtiene ÚNICAMENTE de secretos de Firebase
// Se debe configurar con: firebase functions:secrets:set DEEPSEEK_API_KEY "tu-clave-api"
const getApiKey = () => {
    // Usar la variable DEEPSEEK_API_KEY para producción
    const apiKeyFromSecret = process.env.DEEPSEEK_API_KEY;
    if (apiKeyFromSecret) {
        console.log('Usando API key de secreto de Firebase');
        return apiKeyFromSecret;
    }
    // Si no hay secreto configurado, lanzar error
    console.error('API key de DeepSeek no configurada en secretos de Firebase');
    throw new functions.https.HttpsError('failed-precondition', 'La API key de DeepSeek no está configurada. Por favor, configure el secreto DEEPSEEK_API_KEY.');
};
// Función proxy para llamar a la API de DeepSeek
exports.deepseekProxy = functions.https.onRequest((request, response) => {
    console.log('Recibida solicitud a deepseekProxy:', request.method, request.url);
    // Manejar solicitudes OPTIONS para CORS preflight
    if (request.method === 'OPTIONS') {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.set('Access-Control-Max-Age', '3600');
        response.status(204).send('');
        return;
    }
    corsHandler(request, response, async () => {
        // Solo permitir solicitudes POST
        if (request.method !== 'POST') {
            response.status(405).send('Método no permitido');
            return;
        }
        try {
            const { topic, difficulty, type } = request.body;
            console.log('Parámetros recibidos:', { topic, difficulty, type });
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
            try {
                const apiKey = getApiKey();
                console.log('Enviando solicitud a DeepSeek con prompt:', prompt);
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
                        'Authorization': `Bearer ${apiKey}`
                    },
                    timeout: 15000 // Tiempo de espera de 15 segundos
                });
                console.log('Respuesta recibida de DeepSeek, status:', deepseekResponse.status);
                // Procesar la respuesta de DeepSeek
                if (deepseekResponse.data && deepseekResponse.data.choices && deepseekResponse.data.choices[0].message.content) {
                    const content = deepseekResponse.data.choices[0].message.content;
                    console.log("Contenido de la respuesta de DeepSeek:", content.substring(0, 200) + '...');
                    try {
                        // Intentamos extraer el array JSON de la respuesta
                        let exercises;
                        const match = content.match(/\[.*\]/s);
                        if (match) {
                            console.log('Encontrado array JSON en la respuesta');
                            exercises = JSON.parse(match[0]);
                        }
                        else if (content.includes('{') && content.includes('}')) {
                            // Si no hay corchetes pero hay llaves, intentamos parsear como JSON
                            console.log('Intentando parsear JSON desde la respuesta');
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
                            console.log('Enviando respuesta con ejercicios:', exercises.length);
                            response.status(200).json({ success: true, exercises });
                            return;
                        }
                        else {
                            console.error('No se pudieron extraer ejercicios de la respuesta');
                            throw new Error('No se pudieron extraer ejercicios de la respuesta');
                        }
                    }
                    catch (parseError) {
                        console.error("Error al parsear la respuesta:", parseError);
                        throw parseError;
                    }
                }
                else {
                    console.error('Respuesta inválida de DeepSeek:', deepseekResponse.data);
                    throw new Error('Respuesta inválida de DeepSeek');
                }
            }
            catch (apiError) {
                console.error('Error al llamar a la API de DeepSeek:', apiError);
                throw new Error('Error al comunicarse con la API de DeepSeek: ' +
                    (apiError instanceof Error ? apiError.message : 'Error desconocido'));
            }
        }
        catch (error) {
            console.error('Error en la función proxy:', error);
            // Devolvemos una respuesta más detallada para facilitar la depuración
            response.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                message: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    });
});
//# sourceMappingURL=index.js.map