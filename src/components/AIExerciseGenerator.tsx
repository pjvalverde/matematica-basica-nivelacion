import React, { useState } from 'react';
import { generateAIExercises } from '../firebase/apiConfig';
import './FactorizationExercises.css'; // Reutilizamos el mismo CSS

interface AIExerciseGeneratorProps {
  topic: 'factorization' | 'rationalfractions';
  onExercisesGenerated: (exercises: any[]) => void;
}

// Función para obtener un número aleatorio entre min y max (ambos inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Función para barajar un array (algoritmo Fisher-Yates)
const shuffleArray = <T extends any>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Ejemplos predefinidos para mostrar inmediatamente
const getLocalExercises = (topic: 'factorization' | 'rationalfractions', difficulty: 'easy' | 'medium' | 'hard', type: string) => {
  console.log('[EJERCICIOS LOCALES] Generando ejercicios para:', { topic, difficulty, type });
  
  let exercisesPool: any[] = [];
  let finalPool: any[] = [];
  
  // Ejercicios de factorización
  if (topic === 'factorization') {
    // SELECCIONAR POR DIFICULTAD
    if (difficulty === 'easy') {
      exercisesPool = [
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
        },
        {
          problem: "x^2 + 7x + 12",
          solution: "(x + 3)(x + 4)",
          hint: "Busca dos números que multiplicados den 12 y sumados den 7"
        },
        {
          problem: "x^2 + 4x + 4",
          solution: "(x + 2)^2",
          hint: "Es un trinomio cuadrado perfecto"
        },
        {
          problem: "x^2 - 4x + 4",
          solution: "(x - 2)^2",
          hint: "Es un trinomio cuadrado perfecto"
        }
      ];
    } else if (difficulty === 'medium') {
      exercisesPool = [
        {
          problem: "x^2 - 6x + 9",
          solution: "(x - 3)^2",
          hint: "Es un trinomio cuadrado perfecto"
        },
        {
          problem: "4x^2 - 25",
          solution: "(2x - 5)(2x + 5)",
          hint: "Es una diferencia de cuadrados"
        },
        {
          problem: "3x^2 + 6x - 24",
          solution: "3(x + 4)(x - 2)",
          hint: "Saca factor común y factoriza el trinomio resultante"
        },
        {
          problem: "x^2 - 8x + 15",
          solution: "(x - 3)(x - 5)",
          hint: "Busca dos números que multiplicados den 15 y sumados den -8"
        },
        {
          problem: "4x^2 - 12x + 9",
          solution: "(2x - 3)^2",
          hint: "Escribe como (ax + b)² donde a² = 4 y b² = 9"
        },
        {
          problem: "6x^2 + 11x - 10",
          solution: "(2x - 1)(3x + 10)",
          hint: "Factoriza usando el método de agrupación o la fórmula general"
        }
      ];
    } else { // hard
      exercisesPool = [
        {
          problem: "x^3 - 8",
          solution: "(x - 2)(x^2 + 2x + 4)",
          hint: "Es una diferencia de cubos: a³ - b³ = (a - b)(a² + ab + b²)"
        },
        {
          problem: "x^4 - 16",
          solution: "(x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)",
          hint: "Primero factoriza como diferencia de cuadrados, luego sigue factorizando"
        },
        {
          problem: "2x^3 - 54x",
          solution: "2x(x^2 - 27) = 2x(x - 3√3)(x + 3√3)",
          hint: "Saca factor común y luego factoriza la diferencia de cuadrados"
        },
        {
          problem: "x^3 + 27",
          solution: "(x + 3)(x^2 - 3x + 9)",
          hint: "Es una suma de cubos: a³ + b³ = (a + b)(a² - ab + b²)"
        },
        {
          problem: "3x^2 - 75",
          solution: "3(x^2 - 25) = 3(x - 5)(x + 5)",
          hint: "Saca factor común y luego usa la fórmula de diferencia de cuadrados"
        },
        {
          problem: "x^4 - 5x^2 + 6",
          solution: "(x^2 - 2)(x^2 - 3)",
          hint: "Trátalo como un cuadrático en x² y factoriza"
        }
      ];
    }
  } 
  // Ejercicios de fracciones algebraicas
  else {
    // IMPORTANTE: Siempre tenemos que considerar el TIPO primero
    // Ejercicios de suma y resta
    if (type === 'addition_subtraction') {
      if (difficulty === 'easy') {
        exercisesPool = [
          {
            problem: "\\frac{2}{x} + \\frac{3}{x}",
            solution: "\\frac{5}{x}",
            hint: "Suma directamente los numeradores por tener el mismo denominador"
          },
          {
            problem: "\\frac{3}{y} + \\frac{2}{y}",
            solution: "\\frac{5}{y}",
            hint: "Como los denominadores son iguales, suma los numeradores"
          },
          {
            problem: "\\frac{x}{2} - \\frac{x}{4}",
            solution: "\\frac{x}{4}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          }
        ];
      } else if (difficulty === 'medium') {
        exercisesPool = [
          {
            problem: "\\frac{1}{x+1} + \\frac{2}{x+2}",
            solution: "\\frac{(x+2) + 2(x+1)}{(x+1)(x+2)} = \\frac{3x+4}{(x+1)(x+2)}",
            hint: "Encuentra el denominador común"
          },
          {
            problem: "\\frac{3}{x-2} - \\frac{1}{x+1}",
            solution: "\\frac{3(x+1) - (x-2)}{(x-2)(x+1)} = \\frac{3x+3-x+2}{(x-2)(x+1)} = \\frac{2x+5}{(x-2)(x+1)}",
            hint: "Encuentra el denominador común (x-2)(x+1)"
          },
          {
            problem: "\\frac{2}{x} + \\frac{1}{x^2}",
            solution: "\\frac{2x + 1}{x^2}",
            hint: "Convierte la primera fracción para tener denominador x²"
          }
        ];
      } else { // hard
        exercisesPool = [
          {
            problem: "\\frac{x}{x-1} + \\frac{1}{x+1}",
            solution: "\\frac{x(x+1) + (x-1)}{(x-1)(x+1)} = \\frac{x^2+x+x-1}{(x-1)(x+1)} = \\frac{x^2+2x-1}{(x-1)(x+1)}",
            hint: "Encuentra el denominador común (x-1)(x+1)"
          },
          {
            problem: "\\frac{1}{x-1} - \\frac{1}{(x-1)^2}",
            solution: "\\frac{x-1 - 1}{(x-1)^2} = \\frac{x-2}{(x-1)^2}",
            hint: "Convierte la primera fracción para tener denominador (x-1)²"
          },
          {
            problem: "\\frac{1}{x^2-1} + \\frac{1}{x-1}",
            solution: "\\frac{1}{(x-1)(x+1)} + \\frac{1}{x-1} = \\frac{1+x+1}{(x-1)(x+1)} = \\frac{x+2}{(x-1)(x+1)}",
            hint: "Factoriza x²-1 como (x-1)(x+1)"
          }
        ];
      }
    } 
    // Ejercicios de simplificación
    else if (type === 'simplification') {
      if (difficulty === 'easy') {
        exercisesPool = [
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
            problem: "\\frac{3x^2}{3x}",
            solution: "x",
            hint: "Simplifica dividiendo numerador y denominador por 3x"
          }
        ];
      } else if (difficulty === 'medium') {
        exercisesPool = [
          {
            problem: "\\frac{x^2-4}{x^2-4x+4}",
            solution: "\\frac{(x-2)(x+2)}{(x-2)^2} = \\frac{x+2}{x-2}",
            hint: "Factoriza numerador y denominador"
          },
          {
            problem: "\\frac{x^3-x^2}{x^2-x}",
            solution: "\\frac{x^2(x-1)}{x(x-1)} = x",
            hint: "Factoriza numerador y denominador para encontrar factores comunes"
          },
          {
            problem: "\\frac{x^2-9}{x-3}",
            solution: "x+3",
            hint: "Factoriza el numerador como (x-3)(x+3)"
          }
        ];
      } else { // hard
        exercisesPool = [
          {
            problem: "\\frac{x^3-8}{x-2}",
            solution: "x^2+2x+4",
            hint: "Factoriza el numerador como (x-2)(x^2+2x+4)"
          },
          {
            problem: "\\frac{x^3-1}{x^2-1}",
            solution: "\\frac{(x-1)(x^2+x+1)}{(x-1)(x+1)} = \\frac{x^2+x+1}{x+1}",
            hint: "Usa las fórmulas de factorización para cubos y cuadrados"
          },
          {
            problem: "\\frac{x^4-16}{x^2-4}",
            solution: "\\frac{(x^2-4)(x^2+4)}{(x-2)(x+2)} = \\frac{(x-2)(x+2)(x^2+4)}{(x-2)(x+2)} = x^2+4",
            hint: "Factoriza paso a paso tanto el numerador como el denominador"
          }
        ];
      }
    } 
    // Ejercicios de multiplicación y división
    else if (type === 'multiplication_division') {
      if (difficulty === 'easy') {
        exercisesPool = [
          {
            problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
            solution: "\\frac{x}{x-1}",
            hint: "Cancela los factores comunes (x+1)"
          },
          {
            problem: "\\frac{2x}{3} \\cdot \\frac{6}{x^2}",
            solution: "\\frac{4}{x}",
            hint: "Multiplica numeradores entre sí y denominadores entre sí, luego simplifica"
          },
          {
            problem: "\\frac{x-1}{x+1} \\cdot \\frac{x+1}{x}",
            solution: "\\frac{x-1}{x}",
            hint: "Cancela los factores comunes (x+1)"
          }
        ];
      } else if (difficulty === 'medium') {
        exercisesPool = [
          {
            problem: "\\frac{x^2-4}{x+2} \\div \\frac{x-2}{x+1}",
            solution: "\\frac{(x-2)(x+2)}{(x+2)} \\cdot \\frac{x+1}{x-2} = \\frac{(x+2)(x+1)}{(x+2)(x-2)} = \\frac{x+1}{x-2}",
            hint: "Para dividir fracciones, multiplica por el recíproco de la segunda"
          },
          {
            problem: "\\frac{x^2-1}{x} \\cdot \\frac{x}{x^2+1}",
            solution: "\\frac{x^2-1}{x^2+1} = \\frac{(x-1)(x+1)}{x^2+1}",
            hint: "Multiplica directamente y factoriza el numerador si es posible"
          },
          {
            problem: "\\frac{x^2}{x-1} \\div \\frac{x}{x^2-1}",
            solution: "\\frac{x^2}{x-1} \\cdot \\frac{x^2-1}{x} = \\frac{x^2(x-1)(x+1)}{x(x-1)} = \\frac{x(x+1)}{1} = x(x+1)",
            hint: "Recuerda que dividir por una fracción es multiplicar por su recíproco"
          }
        ];
      } else { // hard
        exercisesPool = [
          {
            problem: "\\frac{x^2-4}{x+2} \\cdot \\frac{x+2}{x^2+4x+4}",
            solution: "\\frac{(x-2)(x+2)}{(x+2)(x+2)^2} = \\frac{x-2}{(x+2)^2}",
            hint: "Factoriza donde sea posible y cancela factores comunes"
          },
          {
            problem: "\\frac{x^3-1}{x-1} \\div \\frac{x^2+x+1}{x+1}",
            solution: "\\frac{(x-1)(x^2+x+1)}{x-1} \\cdot \\frac{x+1}{x^2+x+1} = \\frac{x+1}{1} = x+1",
            hint: "Factoriza x³-1 como (x-1)(x²+x+1) y luego simplifica"
          },
          {
            problem: "\\frac{x^2-25}{x^2-4} \\cdot \\frac{x-2}{x-5}",
            solution: "\\frac{(x-5)(x+5)}{(x-2)(x+2)} \\cdot \\frac{x-2}{x-5} = \\frac{(x+5)}{(x+2)}",
            hint: "Factoriza las diferencias de cuadrados y cancela factores comunes"
          }
        ];
      }
    } 
    // Ejercicios de operaciones combinadas
    else if (type === 'complex_operations') {
      if (difficulty === 'easy') {
        exercisesPool = [
          // Combinación de suma y producto
          {
            problem: "\\frac{x}{x-1} \\cdot \\frac{2}{x} + \\frac{1}{x-1}",
            solution: "\\frac{2}{x-1} + \\frac{1}{x-1} = \\frac{3}{x-1}",
            hint: "Primero resuelve el producto y luego la suma"
          },
          // Combinación de simplificación y resta
          {
            problem: "\\frac{x^2-1}{x-1} - \\frac{2}{x-1}",
            solution: "x+1 - \\frac{2}{x-1} = \\frac{(x+1)(x-1) - 2}{x-1} = \\frac{x^2-1-2}{x-1} = \\frac{x^2-3}{x-1}",
            hint: "Primero simplifica y luego resta con denominador común"
          },
          // Combinación de suma y división
          {
            problem: "\\frac{1}{x} + \\frac{2}{x^2} \\div \\frac{1}{x}",
            solution: "\\frac{1}{x} + \\frac{2}{x^2} \\cdot x = \\frac{1}{x} + \\frac{2}{x} = \\frac{3}{x}",
            hint: "Para dividir por 1/x, multiplica por x"
          }
        ];
      } else if (difficulty === 'medium') {
        exercisesPool = [
          // Producto y suma con denominador común
          {
            problem: "\\frac{x+1}{x-1} \\cdot \\frac{x-1}{x+2} + \\frac{3}{x+2}",
            solution: "\\frac{x+1}{x+2} + \\frac{3}{x+2} = \\frac{x+1+3}{x+2} = \\frac{x+4}{x+2}",
            hint: "Simplifica el producto y luego suma con denominador común"
          },
          // Simplificación, producto y suma
          {
            problem: "\\frac{x^2-4}{x-2} \\cdot \\frac{1}{x+2} + \\frac{2x}{(x-2)(x+2)}",
            solution: "\\frac{(x-2)(x+2)}{(x-2)(x+2)} + \\frac{2x}{(x-2)(x+2)} = \\frac{1 + 2x}{(x-2)(x+2)}",
            hint: "Simplifica el producto, encuentra el denominador común y suma"
          },
          // División y resta compleja
          {
            problem: "\\frac{x^2+x}{x} \\div \\frac{x+1}{x-1} - \\frac{1}{x-1}",
            solution: "\\frac{x^2+x}{x} \\cdot \\frac{x-1}{x+1} - \\frac{1}{x-1} = \\frac{(x+1)(x-1)}{x+1} - \\frac{1}{x-1} = (x-1) - \\frac{1}{x-1}",
            hint: "Resuelve paso a paso: primero la división, luego la resta"
          }
        ];
      } else { // hard
        exercisesPool = [
          // Operación combinada compleja con factorización
          {
            problem: "\\frac{x^3-1}{x-1} \\cdot \\frac{x+1}{x^2+x+1} + \\frac{x^2-1}{(x-1)(x^2+x+1)}",
            solution: "\\frac{(x-1)(x^2+x+1)}{x-1} \\cdot \\frac{x+1}{x^2+x+1} + \\frac{(x-1)(x+1)}{(x-1)(x^2+x+1)} = \\frac{x+1 + (x+1)}{x^2+x+1} = \\frac{2(x+1)}{x^2+x+1}",
            hint: "Factoriza completamente, simplifica y encuentra el denominador común"
          },
          // Operación con múltiples términos
          {
            problem: "\\frac{1}{x-1} + \\frac{2}{x^2-1} - \\frac{3}{(x-1)(x+1)}",
            solution: "\\frac{1}{x-1} + \\frac{2}{(x-1)(x+1)} - \\frac{3}{(x-1)(x+1)} = \\frac{1}{x-1} + \\frac{2-3}{(x-1)(x+1)} = \\frac{1}{x-1} - \\frac{1}{(x-1)(x+1)} = \\frac{x+1-1}{(x-1)(x+1)} = \\frac{x}{(x-1)(x+1)}",
            hint: "Encuentra el denominador común en cada paso"
          },
          // Mezcla de todas las operaciones
          {
            problem: "\\frac{x^2-4}{x-2} \\div \\frac{x+2}{x^2+4x+4} + \\frac{x-2}{(x+2)^2} \\cdot \\frac{x+2}{x-2}",
            solution: "\\frac{(x-2)(x+2)}{x-2} \\cdot \\frac{(x+2)^2}{x+2} + \\frac{x-2}{(x+2)^2} \\cdot \\frac{x+2}{x-2} = (x+2)^2 + \\frac{(x+2)(x-2)}{(x+2)^2(x-2)} = (x+2)^2 + \\frac{1}{x+2} = \\frac{(x+2)^3 + 1}{(x+2)^2}",
            hint: "Resuelve cada parte por separado y luego combínalas"
          }
        ];
      }
    }
    // Ejercicios generales o básicos si no se especifica tipo
    else {
      if (difficulty === 'easy') {
        exercisesPool = [
          {
            problem: "\\frac{2x}{x^2-1}",
            solution: "\\frac{2x}{(x-1)(x+1)}",
            hint: "Factoriza el denominador como (x-1)(x+1)"
          },
          {
            problem: "\\frac{x+1}{x-1} - \\frac{1}{x-1}",
            solution: "\\frac{x+1-1}{x-1} = \\frac{x}{x-1}",
            hint: "Como los denominadores son iguales, resta los numeradores"
          },
          {
            problem: "\\frac{1}{x-2} + \\frac{3}{x-2}",
            solution: "\\frac{1+3}{x-2} = \\frac{4}{x-2}",
            hint: "Suma los numeradores ya que los denominadores son iguales"
          }
        ];
      } else if (difficulty === 'medium') {
        exercisesPool = [
          {
            problem: "\\frac{x}{x-1} - \\frac{1}{x}",
            solution: "\\frac{x^2 - (x-1)}{x(x-1)} = \\frac{x^2-x+1}{x(x-1)}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          },
          {
            problem: "\\frac{x^2+x}{x} \\cdot \\frac{1}{x+1}",
            solution: "\\frac{x(x+1)}{x(x+1)} = 1",
            hint: "Simplifica sacando factor común en el numerador"
          },
          {
            problem: "\\frac{x-2}{x+2} \\div \\frac{x^2-4}{x-1}",
            solution: "\\frac{x-2}{x+2} \\cdot \\frac{x-1}{(x-2)(x+2)} = \\frac{(x-1)}{(x+2)^2}",
            hint: "Recuerda que x²-4 = (x-2)(x+2)"
          }
        ];
      } else { // hard
        exercisesPool = [
          {
            problem: "\\frac{1}{x-1} + \\frac{1}{x+1} + \\frac{2}{x^2-1}",
            solution: "\\frac{(x+1) + (x-1) + 2}{(x-1)(x+1)} = \\frac{2x+2}{(x-1)(x+1)} = \\frac{2(x+1)}{(x-1)(x+1)} = \\frac{2}{x-1}",
            hint: "Recuerda que x²-1 = (x-1)(x+1) y encuentra el denominador común"
          },
          {
            problem: "\\frac{x^2-9}{x-3} \\cdot \\frac{x^2-4}{x^2+6x+9}",
            solution: "\\frac{(x-3)(x+3)}{x-3} \\cdot \\frac{(x-2)(x+2)}{(x+3)^2} = \\frac{(x+3)(x-2)(x+2)}{(x+3)^2} = \\frac{(x-2)(x+2)}{x+3}",
            hint: "Factoriza donde sea posible y cancela factores comunes"
          },
          {
            problem: "\\frac{x^2-6x+9}{x^3-27} \\div \\frac{x-3}{x^2+3x+9}",
            solution: "\\frac{(x-3)^2}{(x-3)(x^2+3x+9)} \\cdot \\frac{x^2+3x+9}{x-3} = \\frac{(x-3)^2(x^2+3x+9)}{(x-3)^2(x^2+3x+9)} = 1",
            hint: "Factoriza x³-27 como (x-3)(x²+3x+9)"
          }
        ];
      }
    }
  }
  
  // CRUCIALMENTE IMPORTANTE: Si no hay ejercicios específicos para la combinación elegida, 
  // debemos GENERAR ejercicios apropiados en lugar de usar ejercicios genéricos
  if (exercisesPool.length === 0) {
    console.warn(`[EJERCICIOS LOCALES] No se encontraron ejercicios para ${topic}, ${difficulty}, ${type}. Generando ejercicios de respaldo.`);
    
    // Ejercicios de respaldo genéricos según el tema
    if (topic === 'factorization') {
      exercisesPool = [
        {
          problem: "x^2 + 5x + 6",
          solution: "(x + 2)(x + 3)",
          hint: `Ejercicio ${difficulty} de factorización. Busca dos números que multiplicados den 6 y sumados den 5`
        },
        {
          problem: "x^2 - 9",
          solution: "(x + 3)(x - 3)",
          hint: `Ejercicio ${difficulty} de factorización. Es una diferencia de cuadrados`
        },
        {
          problem: "2x^2 + 6x",
          solution: "2x(x + 3)",
          hint: `Ejercicio ${difficulty} de factorización. Factoriza usando el factor común`
        }
      ];
    } else {
      exercisesPool = [
        {
          problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
          solution: "\\frac{x}{x-1}",
          hint: `Ejercicio ${difficulty} de ${type || 'fracciones algebraicas'}. Cancela los factores comunes`
        },
        {
          problem: "\\frac{x^2-1}{x-1}",
          solution: "x+1",
          hint: `Ejercicio ${difficulty} de ${type || 'fracciones algebraicas'}. Factoriza el numerador`
        },
        {
          problem: "\\frac{2}{x} + \\frac{3}{x}",
          solution: "\\frac{5}{x}",
          hint: `Ejercicio ${difficulty} de ${type || 'fracciones algebraicas'}. Suma los numeradores`
        }
      ];
    }
  }
  
  // Añadimos etiquetas explícitas a cada ejercicio
  finalPool = exercisesPool.map(ex => ({
    ...ex,
    difficultyTag: difficulty,
    typeTag: type || 'general'
  }));
  
  // Barajar los ejercicios y devolver solo 3 de ellos
  const shuffledExercises = shuffleArray(finalPool);
  console.log(`[EJERCICIOS LOCALES] Devolviendo ${Math.min(3, shuffledExercises.length)} ejercicios de tipo "${type || 'general'}" y dificultad "${difficulty}"`);
  return shuffledExercises.slice(0, 3);
};

// NUEVA FUNCIÓN: Obtener ejercicios garantizados para cada combinación
const getGuaranteedExercise = (topic: 'factorization' | 'rationalfractions', difficulty: 'easy' | 'medium' | 'hard', type: string) => {
  console.log("🔥 GENERANDO EJERCICIO GARANTIZADO para:", topic, difficulty, type);

  // Para fracciones racionales
  if (topic === 'rationalfractions') {
    // Operaciones combinadas (complejo)
    if (type === 'complex_operations') {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{x^3-1}{x-1} \\cdot \\frac{x+1}{x^2+x+1} + \\frac{x^2-1}{(x-1)(x^2+x+1)}",
          solution: "\\frac{(x-1)(x^2+x+1)}{x-1} \\cdot \\frac{x+1}{x^2+x+1} + \\frac{(x-1)(x+1)}{(x-1)(x^2+x+1)} = \\frac{x+1 + (x+1)}{x^2+x+1} = \\frac{2(x+1)}{x^2+x+1}",
          hint: "Factoriza completamente, simplifica y encuentra el denominador común",
          displayType: "Operaciones complejas con fracciones racionales",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{x+1}{x-1} \\cdot \\frac{x-1}{x+2} + \\frac{3}{x+2}",
          solution: "\\frac{x+1}{x+2} + \\frac{3}{x+2} = \\frac{x+1+3}{x+2} = \\frac{x+4}{x+2}",
          hint: "Simplifica el producto y luego suma con denominador común",
          displayType: "Operaciones complejas con fracciones racionales",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{x}{x-1} \\cdot \\frac{2}{x} + \\frac{1}{x-1}",
          solution: "\\frac{2}{x-1} + \\frac{1}{x-1} = \\frac{3}{x-1}",
          hint: "Primero resuelve el producto y luego la suma",
          displayType: "Operaciones complejas con fracciones racionales",
          displayDifficulty: "Fácil"
        };
      }
    }
    
    // Suma y resta
    else if (type === 'addition_subtraction') {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{x}{x-1} + \\frac{1}{x+1}",
          solution: "\\frac{x(x+1) + (x-1)}{(x-1)(x+1)} = \\frac{x^2+x+x-1}{(x-1)(x+1)} = \\frac{x^2+2x-1}{(x-1)(x+1)}",
          hint: "Encuentra el denominador común (x-1)(x+1)",
          displayType: "Suma y resta de fracciones racionales",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{3}{x-2} - \\frac{1}{x+1}",
          solution: "\\frac{3(x+1) - (x-2)}{(x-2)(x+1)} = \\frac{3x+3-x+2}{(x-2)(x+1)} = \\frac{2x+5}{(x-2)(x+1)}",
          hint: "Encuentra el denominador común (x-2)(x+1)",
          displayType: "Suma y resta de fracciones racionales",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{2}{x} + \\frac{3}{x}",
          solution: "\\frac{5}{x}",
          hint: "Suma directamente los numeradores por tener el mismo denominador",
          displayType: "Suma y resta de fracciones racionales",
          displayDifficulty: "Fácil"
        };
      }
    }
    
    // Multiplicación y división
    else if (type === 'multiplication_division') {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{x^2-25}{x^2-4} \\cdot \\frac{x-2}{x-5}",
          solution: "\\frac{(x-5)(x+5)}{(x-2)(x+2)} \\cdot \\frac{x-2}{x-5} = \\frac{(x+5)}{(x+2)}",
          hint: "Factoriza las diferencias de cuadrados y cancela factores comunes",
          displayType: "Multiplicación y división de fracciones racionales",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{x^2-4}{x+2} \\div \\frac{x-2}{x+1}",
          solution: "\\frac{(x-2)(x+2)}{(x+2)} \\cdot \\frac{x+1}{x-2} = \\frac{(x+2)(x+1)}{(x+2)(x-2)} = \\frac{x+1}{x-2}",
          hint: "Para dividir fracciones, multiplica por el recíproco de la segunda",
          displayType: "Multiplicación y división de fracciones racionales",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{x}{x+1} \\cdot \\frac{x+1}{x-1}",
          solution: "\\frac{x}{x-1}",
          hint: "Cancela los factores comunes (x+1)",
          displayType: "Multiplicación y división de fracciones racionales",
          displayDifficulty: "Fácil"
        };
      }
    }
    
    // Simplificación
    else if (type === 'simplification') {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{x^4-16}{x^2-4}",
          solution: "\\frac{(x^2-4)(x^2+4)}{(x-2)(x+2)} = \\frac{(x-2)(x+2)(x^2+4)}{(x-2)(x+2)} = x^2+4",
          hint: "Factoriza paso a paso tanto el numerador como el denominador",
          displayType: "Simplificación de fracciones racionales",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{x^2-4}{x^2-4x+4}",
          solution: "\\frac{(x-2)(x+2)}{(x-2)^2} = \\frac{x+2}{x-2}",
          hint: "Factoriza numerador y denominador",
          displayType: "Simplificación de fracciones racionales",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{x^2-1}{x-1}",
          solution: "x+1",
          hint: "Factoriza el numerador como (x-1)(x+1)",
          displayType: "Simplificación de fracciones racionales",
          displayDifficulty: "Fácil"
        };
      }
    }
    
    // Fracciones básicas
    else if (type === 'basic') {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{3x^2 + 6x - 24}{9}",
          solution: "\\frac{3(x^2 + 2x - 8)}{9} = \\frac{3(x+4)(x-2)}{9} = \\frac{(x+4)(x-2)}{3}",
          hint: "Primero factoriza el numerador sacando factor común, luego simplifica si es posible",
          displayType: "Fracciones básicas",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{2x^2 + 4x}{6}",
          solution: "\\frac{2x(x+2)}{6} = \\frac{x(x+2)}{3}",
          hint: "Saca factor común en el numerador y simplifica con el denominador",
          displayType: "Fracciones básicas",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{5x}{10}",
          solution: "\\frac{x}{2}",
          hint: "Simplifica dividiendo numerador y denominador por 5",
          displayType: "Fracciones básicas",
          displayDifficulty: "Fácil"
        };
      }
    }
    
    // Por defecto, usar fracciones básicas
    else {
      if (difficulty === 'hard') {
        return {
          problem: "\\frac{3x^2 + 6x - 24}{9}",
          solution: "\\frac{3(x^2 + 2x - 8)}{9} = \\frac{3(x+4)(x-2)}{9} = \\frac{(x+4)(x-2)}{3}",
          hint: "Primero factoriza el numerador sacando factor común, luego simplifica si es posible",
          displayType: "Fracciones básicas",
          displayDifficulty: "Difícil"
        };
      } else if (difficulty === 'medium') {
        return {
          problem: "\\frac{2x^2 + 4x}{6}",
          solution: "\\frac{2x(x+2)}{6} = \\frac{x(x+2)}{3}",
          hint: "Saca factor común en el numerador y simplifica con el denominador",
          displayType: "Fracciones básicas",
          displayDifficulty: "Medio"
        };
      } else { // easy
        return {
          problem: "\\frac{5x}{10}",
          solution: "\\frac{x}{2}",
          hint: "Simplifica dividiendo numerador y denominador por 5",
          displayType: "Fracciones básicas",
          displayDifficulty: "Fácil"
        };
      }
    }
  }
  
  // Para factorización
  else {
    // Algún ejercicio de factorización de respaldo
    return {
      problem: "x^2 + 5x + 6",
      solution: "(x + 2)(x + 3)",
      hint: "Busca dos números que multiplicados den 6 y sumados den 5",
      displayType: "Factorización",
      displayDifficulty: difficulty === 'easy' ? "Fácil" : difficulty === 'medium' ? "Medio" : "Difícil"
    };
  }
};

const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ topic, onExercisesGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [useAI, setUseAI] = useState<boolean>(true); // Por defecto, activamos la IA
  
  // NUEVO: Flag que indica que la UI debe ser forzada
  const [forceUI, setForceUI] = useState<boolean>(true);

  // Opciones de tipo según el tema
  const typeOptions = topic === 'factorization' 
    ? [
        { value: '', label: 'Cualquier tipo' },
        { value: 'factor común', label: 'Factor común' },
        { value: 'diferencia de cuadrados', label: 'Diferencia de cuadrados' },
        { value: 'trinomio cuadrado perfecto', label: 'Trinomio cuadrado perfecto' },
        { value: 'trinomio de la forma ax²+bx+c', label: 'Trinomio general' }
      ]
    : [
        { value: 'basic', label: 'Fracciones básicas' },
        { value: 'simplification', label: 'Simplificación de fracciones' },
        { value: 'addition_subtraction', label: 'Suma y resta' },
        { value: 'multiplication_division', label: 'Multiplicación y división' },
        { value: 'complex_operations', label: 'Operaciones complejas' }
      ];

  // Define dificultad exactamente como aparece en la UI
  const difficultyOptions = [
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Medio' },
    { value: 'hard', label: 'Difícil' }
  ];

  const generateExercises = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Activamos el flag de forzar UI
      setForceUI(true);

      console.log("🔒 INICIANDO GENERACIÓN CON TIPO:", exerciseType, "Y DIFICULTAD:", difficulty);
      
      // Restaurando la lógica original pero manteniendo los fixes de display
      
      // Generar ejercicios locales que coincidan con la selección del usuario (como respaldo)
      const localExercises = getLocalExercises(topic, difficulty, exerciseType);
      
      // Añadir metadatos y displayType/displayDifficulty correctos
      const enhancedExercises = localExercises.map(ex => {
        // Determinar el displayType correcto
        let displayType = "";
        if (topic === 'rationalfractions') {
          if (exerciseType === 'basic') displayType = "Fracciones básicas";
          else if (exerciseType === 'simplification') displayType = "Simplificación de fracciones racionales";
          else if (exerciseType === 'addition_subtraction') displayType = "Suma y resta de fracciones racionales";
          else if (exerciseType === 'multiplication_division') displayType = "Multiplicación y división de fracciones racionales";
          else if (exerciseType === 'complex_operations') displayType = "Operaciones complejas con fracciones racionales";
          else displayType = "Fracciones básicas";
        } else {
          displayType = "Factorización";
        }
        
        // Determinar la displayDifficulty correcta
        const displayDifficulty = difficulty === 'easy' ? "Fácil" : 
                                difficulty === 'medium' ? "Medio" : "Difícil";
        
        return {
          ...ex,
          // Agregar display properties
          displayType: displayType,
          displayDifficulty: displayDifficulty,
          // Metadatos
          metadata: {
            forceUI: true,
            generatedByAI: false,
            difficulty: difficulty,
            type: exerciseType,
            originalType: exerciseType,
            forcedByGenerator: true,
            timestamp: new Date().getTime()
          }
        };
      });
      
      // Si useAI es true, intentar usar la API
      if (useAI) {
        try {
          // Llamar a la API
          console.log(`🔒 Intentando generar ejercicios con IA: Tema=${topic}, Dificultad=${difficulty}, Tipo=${exerciseType}`);
          
          // Llamada a la API
          const apiExercises = await generateAIExercises(topic, difficulty, exerciseType);
          
          if (apiExercises && Array.isArray(apiExercises) && apiExercises.length > 0) {
            console.log('🔒 API devolvió ejercicios:', apiExercises);
            
            // Procesar ejercicios de la API, añadiendo displayType y displayDifficulty
            const processedApiExercises = apiExercises.map(ex => {
              // Determinar el displayType correcto
              let displayType = "";
              if (topic === 'rationalfractions') {
                if (exerciseType === 'basic') displayType = "Fracciones básicas";
                else if (exerciseType === 'simplification') displayType = "Simplificación de fracciones racionales";
                else if (exerciseType === 'addition_subtraction') displayType = "Suma y resta de fracciones racionales";
                else if (exerciseType === 'multiplication_division') displayType = "Multiplicación y división de fracciones racionales";
                else if (exerciseType === 'complex_operations') displayType = "Operaciones complejas con fracciones racionales";
                else displayType = "Fracciones básicas";
              } else {
                displayType = "Factorización";
              }
              
              // Determinar la displayDifficulty correcta
              const displayDifficulty = difficulty === 'easy' ? "Fácil" : 
                                      difficulty === 'medium' ? "Medio" : "Difícil";
              
              return {
                ...ex,
                // Asegurarnos que tengamos display properties correctas
                displayType: displayType,
                displayDifficulty: displayDifficulty,
                // También garantizar que type y difficulty sean correctos
                type: exerciseType,
                difficulty: difficulty,
                // Metadatos
                metadata: {
                  forceUI: true,
                  generatedByAI: true,
                  difficulty: difficulty,
                  type: exerciseType,
                  forcedByGenerator: false,
                  fromApi: true,
                  timestamp: new Date().getTime()
                }
              };
            });
            
            // Usar los ejercicios de la API
            onExercisesGenerated(processedApiExercises);
            setIsLoading(false);
            return;
          }
          
          // Si llegamos aquí, la API falló o devolvió datos incorrectos
          console.warn('⚠️ API falló o devolvió datos incorrectos, usando ejercicios locales');
          setError('No se pudo obtener ejercicios de la IA. Usando ejercicios predefinidos.');
        } catch (apiError) {
          console.error("⚠️ Error al llamar a la API:", apiError);
          setError('Error al conectar con la IA. Usando ejercicios predefinidos.');
        }
      }
      
      // Si no se usa IA o falló, usar los ejercicios locales
      console.log('🔒 Usando ejercicios locales con display correcto');
      
      // Entregar ejercicios locales
      onExercisesGenerated(enhancedExercises);
      
    } catch (error) {
      console.error('⚠️ Error general:', error);
      setError('Ha ocurrido un error. Usando ejercicios predefinidos.');
      
      // Obtener un ejercicio de respaldo con el display correcto
      const backupExercise = getGuaranteedExercise(topic, difficulty, exerciseType);
      
      // Determinar el displayType correcto
      let displayType = "";
      if (topic === 'rationalfractions') {
        if (exerciseType === 'basic') displayType = "Fracciones básicas";
        else if (exerciseType === 'simplification') displayType = "Simplificación de fracciones racionales";
        else if (exerciseType === 'addition_subtraction') displayType = "Suma y resta de fracciones racionales";
        else if (exerciseType === 'multiplication_division') displayType = "Multiplicación y división de fracciones racionales";
        else if (exerciseType === 'complex_operations') displayType = "Operaciones complejas con fracciones racionales";
        else displayType = "Fracciones básicas";
      } else {
        displayType = "Factorización";
      }
      
      // Determinar la displayDifficulty correcta
      const displayDifficulty = difficulty === 'easy' ? "Fácil" : 
                              difficulty === 'medium' ? "Medio" : "Difícil";
      
      const backupExercises = [
        {
          ...backupExercise,
          displayType: displayType,
          displayDifficulty: displayDifficulty,
          type: exerciseType,
          difficulty: difficulty,
          metadata: {
            forceUI: true,
            generatedByAI: false,
            difficulty: difficulty,
            type: exerciseType,
            isEmergencyBackup: true,
            timestamp: new Date().getTime()
          }
        }
      ];
      
      onExercisesGenerated(backupExercises);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-exercise-generator">
      <h3>Generar ejercicios personalizados</h3>
      <p>
        Selecciona las opciones para generar ejercicios según tus necesidades.
      </p>
      
      <div className="generator-controls">
        <div className="control-group">
          <label htmlFor="difficulty">Dificultad:</label>
          <select 
            id="difficulty" 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          >
            {difficultyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="exercise-type">Tipo de ejercicio:</label>
          <select 
            id="exercise-type" 
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group checkbox-control">
          <label>
            <input 
              type="checkbox" 
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Usar IA para generar (Plan Blaze)
          </label>
        </div>
        
        {/* NUEVO: Opción para forzar la UI */}
        <div className="control-group checkbox-control">
          <label>
            <input 
              type="checkbox" 
              checked={forceUI}
              onChange={(e) => setForceUI(e.target.checked)}
            />
            Forzar UI (Mantener selecciones)
          </label>
        </div>
        
        <button 
          className={`generate-button ${useAI ? 'generate-ai-button' : ''}`}
          onClick={generateExercises}
          disabled={isLoading}
        >
          {isLoading ? 'Generando...' : useAI ? 'Generar con IA' : 'Generar ejercicios'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIExerciseGenerator; 