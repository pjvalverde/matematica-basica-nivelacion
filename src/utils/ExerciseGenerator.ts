// Utility class to generate different types of math exercises
class ExerciseGenerator {
  // Generate random integer between min and max (inclusive)
  private static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Generate random variable (x, y, z, a, b, c)
  private static getRandomVariable(): string {
    const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
    return variables[this.getRandomInt(0, variables.length - 1)];
  }

  // Generate a random coefficient (-10 to 10, excluding 0)
  private static getRandomCoefficient(min: number = -10, max: number = 10): number {
    let coef = this.getRandomInt(min, max);
    return coef === 0 ? 1 : coef;
  }

  // Format coefficient (-1 becomes -, 1 becomes empty string, others as is)
  private static formatCoefficient(coef: number): string {
    if (coef === 1) return '';
    if (coef === -1) return '-';
    return coef.toString();
  }

  // Format term (combine coefficient and variable)
  private static formatTerm(coef: number, variable: string): string {
    const formattedCoef = this.formatCoefficient(coef);
    return `${formattedCoef}${variable}`;
  }

  // Generate binomial (ax + b) with random coefficients
  private static generateBinomial(variable: string, min: number = -10, max: number = 10): string {
    const a = this.getRandomCoefficient(min, max);
    const b = this.getRandomCoefficient(min, max);
    
    const term1 = this.formatTerm(a, variable);
    
    if (b === 0) return term1;
    
    const sign = b > 0 ? '+' : '';
    return `(${term1}${sign}${b})`;
  }

  // Generate notable product exercise: (a+b)²
  private static generateSquareBinomialSum(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 5);
    const b = this.getRandomCoefficient(1, 5);
    
    const term1 = this.formatTerm(a, variable);
    
    return {
      exercise: `(${term1}+${b})^2`,
      solution: `${a*a}${variable}^2+${2*a*b}${variable}+${b*b}`
    };
  }

  // Generate notable product exercise: (a-b)²
  private static generateSquareBinomialDiff(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 5);
    const b = this.getRandomCoefficient(1, 5);
    
    const term1 = this.formatTerm(a, variable);
    const term2 = this.formatTerm(b, variable === 'x' ? 'y' : 'x');
    
    return {
      exercise: `(${term1}-${term2})^2`,
      solution: `${a*a}${variable}^2-${2*a*b}${variable}${variable === 'x' ? 'y' : 'x'}+${b*b}${variable === 'x' ? 'y' : 'x'}^2`
    };
  }

  // Generate notable product exercise: (a+b)(a-b)
  private static generateProductSumDiff(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 5);
    const b = this.getRandomCoefficient(1, 5);
    
    const term1 = this.formatTerm(a, variable);
    const term2 = this.formatTerm(b, variable === 'x' ? 'y' : 'x');
    
    return {
      exercise: `(${term1}+${term2})(${term1}-${term2})`,
      solution: `${a*a}${variable}^2-${b*b}${variable === 'x' ? 'y' : 'x'}^2`
    };
  }

  // Generate notable product exercise: (a+b)³
  private static generateCubeBinomialSum(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 3);
    const b = this.getRandomCoefficient(1, 3);
    
    const term1 = this.formatTerm(a, variable);
    
    return {
      exercise: `(${term1}+${b})^3`,
      solution: `${a*a*a}${variable}^3+${3*a*a*b}${variable}^2+${3*a*b*b}${variable}+${b*b*b}`
    };
  }

  // Generate notable product exercise: (x+√2)²
  private static generateSquareBinomialWithSqrt(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 3);
    const sqrtValue = this.getRandomInt(2, 5);
    
    const term1 = this.formatTerm(a, variable);
    
    return {
      exercise: `(${term1}+\\sqrt{${sqrtValue}})^2`,
      solution: `${a*a}${variable}^2+${2*a}${variable}\\sqrt{${sqrtValue}}+${sqrtValue}`
    };
  }

  // Generate notable product exercise: (x±y±z)²
  private static generateSquareTrinomial(): { exercise: string, solution: string } {
    const x = this.getRandomVariable();
    let y = this.getRandomVariable();
    while (y === x) y = this.getRandomVariable();
    let z = this.getRandomVariable();
    while (z === x || z === y) z = this.getRandomVariable();
    
    const sign1 = this.getRandomInt(0, 1) === 0 ? '+' : '-';
    const sign2 = this.getRandomInt(0, 1) === 0 ? '+' : '-';
    
    const signMultiplier1 = sign1 === '+' ? 1 : -1;
    const signMultiplier2 = sign2 === '+' ? 1 : -1;
    
    return {
      exercise: `(${x}${sign1}${y}${sign2}${z})^2`,
      solution: `${x}^2${sign1}2${x}${y}${sign2}2${x}${z}+${y}^2${sign1 === sign2 ? '+' : '-'}2${y}${z}+${z}^2`
    };
  }

  // Generate notable product exercise: (ax±by)(cx±dy)
  private static generateProductOfBinomials(): { exercise: string, solution: string } {
    const x = 'x';
    const y = 'y';
    const a = this.getRandomCoefficient(1, 5);
    const b = this.getRandomCoefficient(1, 5);
    const c = this.getRandomCoefficient(1, 5);
    const d = this.getRandomCoefficient(1, 5);
    
    const sign = this.getRandomInt(0, 1) === 0 ? '+' : '-';
    const signMultiplier = sign === '+' ? 1 : -1;
    
    const term1a = this.formatTerm(a, x);
    const term1b = this.formatTerm(b, y);
    const term2a = this.formatTerm(c, x);
    const term2b = this.formatTerm(d, y);
    
    return {
      exercise: `(${term1a}${sign}${term1b})(${term2a}${sign}${term2b})`,
      solution: `${a*c}${x}^2${sign}${a*d + b*c}${x}${y}${sign}${b*d}${y}^2`
    };
  }

  // Generate notable product exercise: (x²+2x+1)(x²-2x+1)
  private static generateProductOfTrinomials(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 3);
    const b = 2 * a;
    const c = a * a;
    
    return {
      exercise: `(${variable}^2+${b}${variable}+${c})(${variable}^2-${b}${variable}+${c})`,
      solution: `${variable}^4-${b*b}${variable}^2+${c*c}`
    };
  }

  // Generate order of operations exercise
  private static generateOrderOfOperations(difficulty: 'easy' | 'medium' | 'hard'): { exercise: string, solution: string } {
    let exercise = '';
    let solution = 0;

    switch (difficulty) {
      case 'easy':
        // Simple exercise with addition, subtraction and one level of parentheses
        const a = this.getRandomInt(1, 20);
        const b = this.getRandomInt(1, 20);
        const c = this.getRandomInt(1, 20);
        
        exercise = `${a} + ${b} * ${c}`;
        solution = a + b * c;
        break;
        
      case 'medium':
        // More operations and possibly nested parentheses
        const d = this.getRandomInt(1, 15);
        const e = this.getRandomInt(1, 15);
        const f = this.getRandomInt(1, 15);
        const g = this.getRandomInt(1, 15);
        
        exercise = `${d} + ${e} * (${f} - ${g})`;
        solution = d + e * (f - g);
        break;
        
      case 'hard':
        // Complex operations, nested parentheses, and possibly exponents
        const h = this.getRandomInt(1, 10);
        const i = this.getRandomInt(1, 10);
        const j = this.getRandomInt(1, 10);
        const k = this.getRandomInt(1, 10);
        const l = this.getRandomInt(2, 4);
        
        exercise = `(${h} + ${i})^2 / (${j} * ${k} - ${l})`;
        solution = Math.pow(h + i, 2) / (j * k - l);
        break;
    }

    return {
      exercise,
      solution: solution.toString()
    };
  }

  // Generate polynomial multiplication exercise
  private static generatePolynomialMultiplication(): { exercise: string, solution: string } {
    const variable = this.getRandomVariable();
    const a = this.getRandomCoefficient(1, 5);
    const b = this.getRandomCoefficient(-5, 5);
    const c = this.getRandomCoefficient(1, 5);
    
    const term1 = `${this.formatCoefficient(a)}${variable}^3`;
    const term2 = b !== 0 ? `${b > 0 ? '+' : ''}${this.formatCoefficient(b)}${variable}` : '';
    const term3 = c !== 0 ? `${c > 0 ? '+' : ''}${c}` : '';
    
    return {
      exercise: `${term1}${term2}${term3} \\cdot (${this.getRandomInt(2, 5)})`,
      solution: `${a * 2}${variable}^3${b !== 0 ? `${b > 0 ? '+' : ''}${b * 2}${variable}` : ''}${c !== 0 ? `${c > 0 ? '+' : ''}${c * 2}` : ''}`
    };
  }

  // Generate complex order of operations exercise
  private static generateComplexOrderOfOperations(): { exercise: string, solution: string } {
    const a = this.getRandomInt(1, 10);
    const b = this.getRandomInt(2, 6);
    const c = this.getRandomInt(1, 5);
    const d = this.getRandomInt(1, 5);
    const e = this.getRandomInt(2, 4);
    
    const exercise = `${a} + \\frac{${b}}{2}(${c} - ${d})^3 - ${e}^2`;
    // This is a simplified calculation - in a real app, you'd implement proper math evaluation
    const solution = a + (b/2) * Math.pow((c - d), 3) - Math.pow(e, 2);
    
    return {
      exercise,
      solution: solution.toString()
    };
  }

  // Main method to generate exercises
  public static generate(type: 'notables' | 'operations', difficulty: 'easy' | 'medium' | 'hard'): { exercise: string, solution: string } {
    if (type === 'notables') {
      // Choose a random notable product type based on difficulty
      const notableTypes = {
        easy: [
          this.generateSquareBinomialSum,
          this.generateProductSumDiff
        ],
        medium: [
          this.generateSquareBinomialSum, 
          this.generateSquareBinomialDiff, 
          this.generateProductSumDiff,
          this.generateSquareBinomialWithSqrt
        ],
        hard: [
          this.generateSquareBinomialSum, 
          this.generateSquareBinomialDiff, 
          this.generateProductSumDiff, 
          this.generateCubeBinomialSum,
          this.generateSquareBinomialWithSqrt,
          this.generateSquareTrinomial,
          this.generateProductOfBinomials,
          this.generateProductOfTrinomials
        ]
      };
      
      const availableTypes = notableTypes[difficulty];
      const randomType = availableTypes[this.getRandomInt(0, availableTypes.length - 1)];
      
      return randomType.call(this);
    } else {
      // Order of operations exercise
      const operationTypes = {
        easy: [
          this.generateOrderOfOperations
        ],
        medium: [
          this.generateOrderOfOperations,
          this.generatePolynomialMultiplication
        ],
        hard: [
          this.generateOrderOfOperations,
          this.generatePolynomialMultiplication,
          this.generateComplexOrderOfOperations
        ]
      };
      
      const availableTypes = operationTypes[difficulty];
      const randomType = availableTypes[this.getRandomInt(0, availableTypes.length - 1)];
      
      return randomType.call(this, difficulty);
    }
  }

  // Method to fetch predefined exercises
  public static getPredefinedExercises(type: 'notables' | 'operations'): { exercise: string, solution: string }[] {
    if (type === 'notables') {
      return [
        // Ejercicios de calentamiento (imagen 1)
        { exercise: "(x + 3)^2", solution: "x^2 + 6x + 9" },
        { exercise: "(2x - 5)^2", solution: "4x^2 - 20x + 25" },
        { exercise: "(x + 4)(x - 4)", solution: "x^2 - 16" },
        { exercise: "(3x + 2)(3x - 2)", solution: "9x^2 - 4" },
        { exercise: "(x + \\sqrt{2})^2", solution: "x^2 + 2x\\sqrt{2} + 2" },
        { exercise: "(3a - 2b)^2", solution: "9a^2 - 12ab + 4b^2" },
        { exercise: "(2x + 5y)(2x - 5y)", solution: "4x^2 - 25y^2" },
        { exercise: "(x^2 + 3x + 1)^2", solution: "x^4 + 6x^3 + 11x^2 + 6x + 1" },
        { exercise: "(x + y + z)^2", solution: "x^2 + 2xy + 2xz + y^2 + 2yz + z^2" },
        { exercise: "(\\sqrt{x} + \\sqrt{y})(\\sqrt{x} - \\sqrt{y})", solution: "x - y" },
        { exercise: "\\left(2x + \\frac{3}{2}\\right)^2", solution: "4x^2 + 6x + \\frac{9}{4}" },
        { exercise: "\\left(\\sqrt{3}x - \\frac{2}{\\sqrt{3}}\\right)^2", solution: "3x^2 - 4x + \\frac{4}{3}" },
        { exercise: "(x^2 + 2x + 1)(x^2 - 2x + 1)", solution: "x^4 - 4x^2 + 1" },
        { exercise: "(2x + 3y)^2 - (2x - 3y)^2", solution: "24xy" },
        { exercise: "(\\sqrt{x} + \\sqrt{y})^2", solution: "x + 2\\sqrt{xy} + y" }
      ];
    } else {
      return [
        // Ejercicios de la imagen 2 (pregunta 1)
        { exercise: "4x^5(x^3 - 2x + 5)", solution: "4x^8 - 8x^6 + 20x^5" },
        { exercise: "(3x + 2y)(3x - 2y)", solution: "9x^2 - 4y^2" },
        { exercise: "(x + y)^2 + 5(x - y)^2", solution: "6x^2 + 4xy + 6y^2" },
        { exercise: "3 + \\frac{6}{2}(5 - 3)^3 - 4^2", solution: "-7" },
        { exercise: "3\\sqrt{x}(2x - 5\\sqrt{x} + 7)", solution: "6x\\sqrt{x} - 15x + 21\\sqrt{x}" },
        { exercise: "-3 \\{2x[2x + 3] + 5 [4x^2 - (3 - 4x)]\\}", solution: "-3(4x^2 + 6x + 20x^2 - 15 + 20x)" }
      ];
    }
  }
}

export default ExerciseGenerator; 