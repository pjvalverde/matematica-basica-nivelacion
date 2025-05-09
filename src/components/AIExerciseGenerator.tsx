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
  let exercisesPool: any[] = [];
  
  // Ejercicios de factorización
  if (topic === 'factorization') {
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
    // Ejercicios de suma y resta
    if (type && type.includes('suma')) {
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
          },
          {
            problem: "\\frac{3}{x} - \\frac{1}{x}",
            solution: "\\frac{2}{x}",
            hint: "Resta directamente los numeradores al tener el mismo denominador"
          },
          {
            problem: "\\frac{5}{y} + \\frac{y}{y}",
            solution: "\\frac{5+y}{y}",
            hint: "Suma los numeradores cuando los denominadores son iguales"
          },
          {
            problem: "\\frac{2a}{3} + \\frac{a}{3}",
            solution: "\\frac{3a}{3} = a",
            hint: "Suma los numeradores y simplifica"
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
          },
          {
            problem: "\\frac{3}{x-1} - \\frac{2}{x+2}",
            solution: "\\frac{3(x+2) - 2(x-1)}{(x-2)(x+2)} = \\frac{3x+6-2x+2}{(x-2)(x+2)} = \\frac{x+8}{(x-2)(x+2)}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          },
          {
            problem: "\\frac{2}{x^2} + \\frac{3}{x}",
            solution: "\\frac{2 + 3x}{x^2}",
            hint: "Convierte todas las fracciones al mismo denominador"
          },
          {
            problem: "\\frac{x}{x+2} + \\frac{2}{x-1}",
            solution: "\\frac{x(x-1) + 2(x+2)}{(x+2)(x-1)} = \\frac{x^2-x+2x+4}{(x+2)(x-1)} = \\frac{x^2+x+4}{(x+2)(x-1)}",
            hint: "Escribe ambas fracciones con el denominador común"
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
          },
          {
            problem: "\\frac{3}{x^2-4} - \\frac{2}{x+2}",
            solution: "\\frac{3}{(x-2)(x+2)} - \\frac{2}{x+2} = \\frac{3 - 2(x-2)}{(x-2)(x+2)} = \\frac{7 - 2x}{(x-2)(x+2)}",
            hint: "Factoriza el denominador x²-4 = (x-2)(x+2)"
          },
          {
            problem: "\\frac{x}{x^2-9} + \\frac{2}{x-3}",
            solution: "\\frac{x}{(x-3)(x+3)} + \\frac{2}{x-3} = \\frac{x + 2(x+3)}{(x-3)(x+3)} = \\frac{x + 2x + 6}{(x-3)(x+3)} = \\frac{3x + 6}{(x-3)(x+3)}",
            hint: "Factoriza el denominador x²-9 = (x-3)(x+3)"
          },
          {
            problem: "\\frac{2}{x-1} + \\frac{3}{(x-1)^2} - \\frac{5}{(x-1)^3}",
            solution: "\\frac{2(x-1)^2 + 3(x-1) - 5}{(x-1)^3} = \\frac{2(x-1)^2 + 3(x-1) - 5}{(x-1)^3}",
            hint: "Convierte todo al denominador común (x-1)³"
          }
        ];
      }
    } 
    // Ejercicios de simplificación
    else if (type && type.includes('simplifica')) {
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
          },
          {
            problem: "\\frac{x^2-4}{x-2}",
            solution: "x+2",
            hint: "Factoriza el numerador como (x-2)(x+2)"
          },
          {
            problem: "\\frac{2x^2+2x}{2x}",
            solution: "x+1",
            hint: "Factoriza el numerador como 2x(x+1)"
          },
          {
            problem: "\\frac{x^2+2x}{x}",
            solution: "x+2",
            hint: "Saca factor común x en el numerador"
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
          },
          {
            problem: "\\frac{x^3+x^2}{x^2+x}",
            solution: "\\frac{x^2(x+1)}{x(x+1)} = x",
            hint: "Factoriza el numerador y denominador para encontrar factores comunes"
          },
          {
            problem: "\\frac{x^2+2x-3}{x-1}",
            solution: "\\frac{(x-1)(x+3)}{x-1} = x+3",
            hint: "Factoriza el numerador y simplifica con el denominador"
          },
          {
            problem: "\\frac{x^2-x-6}{x^2-9}",
            solution: "\\frac{(x-3)(x+2)}{(x-3)(x+3)} = \\frac{x+2}{x+3}",
            hint: "Factoriza tanto el numerador como el denominador"
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
          },
          {
            problem: "\\frac{x^3-27}{x-3}",
            solution: "x^2+3x+9",
            hint: "Factoriza usando la fórmula de la diferencia de cubos"
          },
          {
            problem: "\\frac{x^4-1}{x^2-1}",
            solution: "\\frac{(x^2-1)(x^2+1)}{(x-1)(x+1)} = x^2+1",
            hint: "Factoriza x⁴-1 como (x²-1)(x²+1) y x²-1 como (x-1)(x+1)"
          },
          {
            problem: "\\frac{x^3+x^2-x-1}{x^2-1}",
            solution: "\\frac{(x+1)(x^2-1)}{(x-1)(x+1)} = \\frac{(x+1)(x^2-1)}{(x-1)(x+1)} = x+1",
            hint: "Factoriza el numerador como (x+1)(x²-1)"
          }
        ];
      }
    } 
    // Ejercicios de multiplicación y división
    else if (type && type.includes('multi')) {
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
          },
          {
            problem: "\\frac{3x}{4} \\cdot \\frac{2}{3x}",
            solution: "\\frac{1}{2}",
            hint: "Multiplica numeradores y denominadores, luego simplifica los términos comunes"
          },
          {
            problem: "\\frac{x+2}{x-2} \\cdot \\frac{x-2}{x+3}",
            solution: "\\frac{x+2}{x+3}",
            hint: "Cancela los factores comunes (x-2)"
          },
          {
            problem: "\\frac{2x}{5} \\cdot \\frac{10}{x}",
            solution: "4",
            hint: "Simplifica los términos comunes en numerador y denominador"
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
          },
          {
            problem: "\\frac{x^2+2x+1}{x+1} \\cdot \\frac{x-1}{x^2-1}",
            solution: "\\frac{(x+1)^2}{x+1} \\cdot \\frac{x-1}{(x-1)(x+1)} = \\frac{(x+1)^2(x-1)}{(x+1)(x-1)(x+1)} = \\frac{(x+1)^2}{x^2+x+1}",
            hint: "Factoriza x²+2x+1 = (x+1)² y x²-1 = (x-1)(x+1)"
          },
          {
            problem: "\\frac{2x+6}{x^2-9} \\cdot \\frac{x+3}{x+3}",
            solution: "\\frac{2(x+3)}{(x-3)(x+3)} \\cdot \\frac{x+3}{x+3} = \\frac{2(x+3)^2}{(x-3)(x+3)^2} = \\frac{2}{x-3}",
            hint: "Factoriza 2x+6 = 2(x+3) y x²-9 = (x-3)(x+3)"
          },
          {
            problem: "\\frac{x^2-4}{2x} \\div \\frac{x+2}{4}",
            solution: "\\frac{(x+2)(x-2)}{2x} \\cdot \\frac{4}{x+2} = \\frac{4(x-2)}{2x} = \\frac{2(x-2)}{x}",
            hint: "Factoriza x²-4 como (x+2)(x-2) y simplifica"
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
          },
          {
            problem: "\\frac{x^3+27}{x+3} \\div \\frac{x^2-3x+9}{x^2-9}",
            solution: "\\frac{(x+3)(x^2-3x+9)}{x+3} \\cdot \\frac{(x-3)(x+3)}{x^2-3x+9} = \\frac{(x-3)(x+3)}{1} = x^2-9",
            hint: "Factoriza x³+27 = (x+3)(x²-3x+9) y x²-9 = (x-3)(x+3)"
          },
          {
            problem: "\\frac{x^4-1}{x^2-1} \\cdot \\frac{x-1}{x^2+1}",
            solution: "\\frac{(x^2-1)(x^2+1)}{(x-1)(x+1)} \\cdot \\frac{x-1}{x^2+1} = \\frac{(x^2+1)(x-1)}{(x+1)} = \\frac{(x-1)(x^2+1)}{x+1}",
            hint: "Factoriza x⁴-1 = (x²-1)(x²+1) y x²-1 = (x-1)(x+1)"
          },
          {
            problem: "\\frac{x^2+2x+1}{x^3-1} \\div \\frac{x+1}{x^2-1}",
            solution: "\\frac{(x+1)^2}{(x-1)(x^2+x+1)} \\cdot \\frac{x^2-1}{x+1} = \\frac{(x+1)^2(x-1)(x+1)}{(x-1)(x^2+x+1)(x+1)} = \\frac{(x+1)^2}{x^2+x+1}",
            hint: "Factoriza x³-1 = (x-1)(x²+x+1) y x²-1 = (x-1)(x+1)"
          }
        ];
      }
    } 
    // Ejercicios generales o complejos
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
          },
          {
            problem: "\\frac{x}{3} \\cdot \\frac{6}{x}",
            solution: "2",
            hint: "Cancela la x y simplifica los números"
          },
          {
            problem: "\\frac{x^2-4}{x-2}",
            solution: "x+2",
            hint: "Factoriza el numerador como (x-2)(x+2)"
          },
          {
            problem: "\\frac{2}{x} + \\frac{3}{x}",
            solution: "\\frac{5}{x}",
            hint: "Suma directamente los numeradores por tener el mismo denominador"
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
          },
          {
            problem: "\\frac{x^2-9}{x-3} \\cdot \\frac{1}{x+3}",
            solution: "\\frac{(x-3)(x+3)}{(x-3)(x+3)} = 1",
            hint: "Factoriza el numerador como (x-3)(x+3)"
          },
          {
            problem: "\\frac{1}{x-1} + \\frac{2}{x+1}",
            solution: "\\frac{(x+1) + 2(x-1)}{(x-1)(x+1)} = \\frac{x+1+2x-2}{(x-1)(x+1)} = \\frac{3x-1}{(x-1)(x+1)}",
            hint: "Encuentra el mínimo común múltiplo de los denominadores"
          },
          {
            problem: "\\frac{x^2-4}{x-2} - \\frac{2}{x-2}",
            solution: "\\frac{(x-2)(x+2) - 2}{x-2} = \\frac{(x-2)(x+2) - 2}{x-2} = \\frac{x(x-2) + 2(x-2) - 2}{x-2} = x+2-\\frac{2}{x-2}",
            hint: "Simplifica la primera fracción y luego resta con el denominador común"
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
          },
          {
            problem: "\\frac{x^3+1}{x+1} \\cdot \\frac{x^2-2x+4}{x^2+x+1}",
            solution: "\\frac{(x+1)(x^2-x+1)}{x+1} \\cdot \\frac{x^2-2x+4}{x^2+x+1} = \\frac{(x^2-x+1)(x^2-2x+4)}{x^2+x+1}",
            hint: "Factoriza x³+1 como (x+1)(x²-x+1)"
          },
          {
            problem: "\\frac{x^2-1}{x-1} + \\frac{x}{x^2-1}",
            solution: "\\frac{(x-1)(x+1)}{x-1} + \\frac{x}{(x-1)(x+1)} = (x+1) + \\frac{x}{(x-1)(x+1)} = x+1+\\frac{x}{(x-1)(x+1)}",
            hint: "Simplifica la primera fracción y mantén la segunda como está"
          },
          {
            problem: "\\frac{x^3-8}{(x-2)^2} \\div \\frac{x^2+2x+4}{x-2}",
            solution: "\\frac{(x-2)(x^2+2x+4)}{(x-2)^2} \\cdot \\frac{x-2}{x^2+2x+4} = \\frac{(x-2)^2(x-2)}{(x-2)^2(x^2+2x+4)} = \\frac{x-2}{x^2+2x+4}",
            hint: "Factoriza x³-8 como (x-2)(x²+2x+4)"
          }
        ];
      }
    }
  }
  
  // Si no se encontró ninguna coincidencia específica, usa una lista genérica
  if (exercisesPool.length === 0) {
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
      }
    ];
  }
  
  // Barajar los ejercicios y devolver solo 3 de ellos
  const shuffledExercises = shuffleArray(exercisesPool);
  return shuffledExercises.slice(0, 3);
};

const AIExerciseGenerator: React.FC<AIExerciseGeneratorProps> = ({ topic, onExercisesGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [useAI, setUseAI] = useState<boolean>(true); // Por defecto, activamos la IA

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
        { value: '', label: 'Cualquier tipo' },
        { value: 'simplificación', label: 'Simplificación' },
        { value: 'suma y resta', label: 'Suma y resta' },
        { value: 'multiplicación y división', label: 'Multiplicación y división' },
        { value: 'operaciones combinadas', label: 'Operaciones combinadas' }
      ];

  const generateExercises = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (useAI) {
        // Usar la API de DeepSeek a través de Firebase Functions
        try {
          // Elige el tipo de ejercicio correctamente según el tema
          let typeParam = exerciseType;
          if (topic === 'rationalfractions') {
            // Asegurarse de que los tipos de fracciones racionales se envíen con el formato que espera la API
            if (exerciseType.includes('simplifica')) {
              typeParam = 'simplificación';
            } else if (exerciseType.includes('suma')) {
              typeParam = 'suma y resta';
            } else if (exerciseType.includes('multi')) {
              typeParam = 'multiplicación y división';
            }
          }
          
          console.log(`Generando ejercicios con IA: Tema=${topic}, Dificultad=${difficulty}, Tipo=${typeParam}`);
          
          const exercises = await generateAIExercises(
            topic, 
            difficulty,
            typeParam
          );
          
          if (exercises && Array.isArray(exercises)) {
            console.log('Ejercicios recibidos de la API:', exercises);
            
            // Verificar si los ejercicios tienen los metadatos adecuados
            if (exercises[0] && !exercises[0].metadata) {
              console.warn('Los ejercicios no tienen metadatos, añadiendo...');
              // Añadir metadatos a los ejercicios generados para preservar selecciones
              const enhancedExercises = exercises.map(ex => ({
                ...ex,
                metadata: {
                  generatedByAI: true,
                  difficulty: difficulty,
                  type: typeParam
                }
              }));
              onExercisesGenerated(enhancedExercises);
            } else {
              console.log('Ejercicios con metadatos:', exercises[0].metadata);
              onExercisesGenerated(exercises);
            }
          } else {
            setError('No se pudieron generar ejercicios. Usando ejercicios predefinidos.');
            console.error('Respuesta inválida o vacía de la API:', exercises);
            const localExercises = getLocalExercises(topic, difficulty, exerciseType);
            onExercisesGenerated(localExercises);
          }
        } catch (apiError) {
          console.error("Error al llamar a la API:", apiError);
          setError('No se pudo conectar con la IA. Usando ejercicios predefinidos.');
          const localExercises = getLocalExercises(topic, difficulty, exerciseType);
          onExercisesGenerated(localExercises);
        }
      } else {
        // Usar ejemplos locales predefinidos sin llamar a la API
        const localExercises = getLocalExercises(topic, difficulty, exerciseType);
        
        // Siempre añadimos metadatos a los ejercicios locales
        const enhancedLocalExercises = localExercises.map(ex => ({
          ...ex,
          metadata: {
            generatedByAI: false,
            difficulty: difficulty,
            type: exerciseType
          }
        }));
        
        setTimeout(() => {
          onExercisesGenerated(enhancedLocalExercises);
        }, 300); // Pequeña demora para simular procesamiento
      }
    } catch (error) {
      console.error('Error al generar ejercicios:', error);
      setError('Ha ocurrido un error. Mostrando ejercicios predefinidos.');
      
      // En caso de error, usar ejercicios predefinidos
      const localExercises = getLocalExercises(topic, difficulty, exerciseType);
      
      // Añadir metadatos a los ejercicios de respaldo
      const enhancedLocalExercises = localExercises.map(ex => ({
        ...ex,
        metadata: {
          generatedByAI: false,
          difficulty: difficulty,
          type: exerciseType
        }
      }));
      
      onExercisesGenerated(enhancedLocalExercises);
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
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
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
        
        {/* Opción visible para todos los usuarios */}
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