# 🧮 Matemática Básica - Nivelación para Administración de Empresas

<div align="center">
  <img src="https://img.shields.io/badge/Nivel-Universitario-blue" alt="Nivel Universitario">
  <img src="https://img.shields.io/badge/Enfoque-Administración-orange" alt="Enfoque Administración">
  <img src="https://img.shields.io/badge/Interactive-Exercises-success" alt="Ejercicios Interactivos">
</div>

<br />

## 📊 Bienvenido al Curso de Nivelación Matemática

> *"Las matemáticas son el alfabeto con el cual Dios ha escrito el universo."* — Galileo Galilei

Esta plataforma ha sido diseñada específicamente para estudiantes universitarios de **Administración de Empresas** que necesitan fortalecer sus habilidades matemáticas fundamentales. No se trata solo de números, sino de construir las bases analíticas que impulsarán tu carrera profesional.

### 🎯 Objetivo

Desarrollar competencias matemáticas esenciales para el análisis empresarial y la toma de decisiones efectivas en el contexto de los negocios modernos.

## 📋 Temas Cubiertos

### 🔢 Álgebra Fundamental
- **Productos Notables**: La base para simplificar expresiones complejas
- **Factorización**: Herramientas para resolver ecuaciones comerciales
- **Ecuaciones Lineales y Cuadráticas**: Modelado de problemas de negocio

### 📈 Aplicaciones Empresariales
- Modelos de costo-beneficio
- Optimización de recursos
- Análisis de punto de equilibrio
- Proyecciones financieras básicas

## 💡 Características de la Plataforma

- **🧪 Ejercicios Interactivos**: Practica con ejercicios que se adaptan a tu nivel
- **📝 Feedback Inmediato**: Recibe retroalimentación instantánea sobre tus respuestas
- **🔄 Diferentes Niveles**: Progresa desde conceptos básicos hasta aplicaciones avanzadas
- **📚 Ejercicios Predefinidos**: Hoja de ejercicios cuidadosamente seleccionados

## 🚀 Cómo Empezar

1. **Accede a la Plataforma**: Visita [https://pjvalverde.github.io/matematica-basica-nivelacion](https://pjvalverde.github.io/matematica-basica-nivelacion)
2. **Selecciona un Tema**: Elige entre productos notables u orden de operaciones
3. **Ajusta la Dificultad**: Personaliza el nivel según tus necesidades
4. **Practica Regularmente**: La consistencia es clave para dominar los conceptos

## 🔗 Recursos Adicionales

- 📗 Libro de referencia: "Matemáticas para Administración y Economía"
- 🎬 Videos explicativos en cada sección
- 📊 Ejemplos de aplicaciones reales en negocios

## 👨‍🏫 Soporte Académico

Para consultas o apoyo adicional, contacta al departamento de Matemáticas Aplicadas de tu universidad o escribe a tu profesor.

---

<div align="center">
  <p><i>Desarrollando el pensamiento analítico para los líderes empresariales del mañana</i></p>
  <p>© 2024 Matemática Básica - Nivelación para Administración de Empresas</p>
</div>

This is a test to trigger a new workflow

# Math Basics - Matemática Básica

Aplicación web para el aprendizaje de matemáticas básicas con ejercicios interactivos.

## Características

- Ejercicios de factorización algebraica
- Ejercicios de fracciones algebraicas racionales
- Sistema de puntajes y tabla de clasificación
- Generación de ejercicios con IA
- Interfaz intuitiva y responsive

## Tecnologías

- React
- TypeScript
- Firebase (Hosting, Authentication, Firestore, Functions)
- DeepSeek AI API

## Implementación de DeepSeek AI con Firebase

Este proyecto ahora utiliza Firebase Functions (Plan Blaze) para integrar la API de DeepSeek de manera segura, evitando problemas de CORS.

### Configuración del proyecto

1. **Requisitos previos**
   - Cuenta de Firebase en el plan Blaze (permite llamadas a APIs externas)
   - Clave API de DeepSeek
   - Node.js y npm instalados

2. **Instalación**
   ```bash
   # Instalar dependencias del proyecto principal
   npm install
   
   # Instalar dependencias de Firebase Functions
   cd functions && npm install
   ```

3. **Configuración de Firebase**
   - Inicializa Firebase si aún no lo has hecho:
     ```bash
     npm install -g firebase-tools
     firebase login
     firebase init
     ```
   - Asegúrate de seleccionar Hosting y Functions durante la inicialización

4. **Configuración de la clave API de DeepSeek**
   Para mantener segura tu clave API, utiliza secretos de Firebase:
   ```bash
   firebase functions:secrets:set DEEPSEEK_API_KEY "tu-clave-api-de-deepseek"
   ```

5. **Compilación de las funciones**
   ```bash
   cd functions
   npm run build
   ```

6. **Despliegue**
   ```bash
   # Desplegar todo el proyecto
   firebase deploy
   
   # Desplegar solo las funciones
   firebase deploy --only functions
   
   # Desplegar solo el hosting
   firebase deploy --only hosting
   ```

## Uso del generador de ejercicios con IA

El componente de generación de ejercicios ahora ofrece dos opciones:
- **Generar con IA**: Utiliza la API de DeepSeek a través de Firebase Functions para crear ejercicios personalizados
- **Generar sin IA**: Utiliza una biblioteca predefinida de ejercicios (fallback automático si la API falla)

### Flujo de trabajo

1. El componente de frontend realiza una petición a la función de Firebase
2. La función de Firebase se comunica con la API de DeepSeek
3. La respuesta se procesa y se devuelve al frontend
4. Si ocurre algún error, se utilizan ejercicios predefinidos como respaldo

## Desarrollo local

Para desarrollo local, configura las variables de entorno:

1. Crea un archivo `.env.local` en la raíz del proyecto:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

2. Inicia el emulador de Firebase Functions:
   ```bash
   firebase emulators:start
   ```

3. Inicia la aplicación React:
   ```bash
   npm start
   ```

## Notas sobre el despliegue

- Asegúrate de que tu plan de Firebase sea Blaze para poder realizar llamadas HTTP externas desde las funciones
- Configura correctamente los CORS en la función para permitir solicitudes solo desde tu dominio
- La clave API se obtiene de secretos de Firebase, proporcionando mayor seguridad

## Demo

La aplicación está desplegada en: https://math-basis.web.app/
