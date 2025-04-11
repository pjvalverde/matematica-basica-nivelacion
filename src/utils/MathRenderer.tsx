import React from 'react';

interface MathRendererProps {
  math: string;
  block?: boolean;
}

// Un componente simple para renderizar expresiones matemáticas
const MathRenderer: React.FC<MathRendererProps> = ({ math, block = false }) => {
  // Reemplazar símbolos matemáticos comunes con representaciones de texto
  const formatMath = (formula: string): string => {
    let result = formula;
    
    // Procesar raíces cuadradas con contenido entre llaves
    result = result.replace(/\\sqrt\{([^{}]+)\}/g, (match, content) => {
      return `√(${content})`;
    });
    
    // Reemplazar expresiones simples
    result = result
      .replace(/\^2/g, '²')  // Cuadrado
      .replace(/\^3/g, '³')  // Cubo
      .replace(/\//g, '÷')   // División
      .replace(/\*/g, '×')   // Multiplicación
      .replace(/sqrt\((\w+)\)/g, '√$1') // Raíz cuadrada de una variable simple
      .replace(/sqrt/g, '√')  // Raíz cuadrada básica
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2') // Fracciones
      .replace(/\^/g, 'ᵏ')   // Exponentes generales
      .replace(/pi/g, 'π')   // Pi
      .replace(/theta/g, 'θ'); // Theta
    
    return result;
  };

  const renderStyles = {
    fontFamily: "'Cambria Math', 'Times New Roman', serif",
    lineHeight: 1.5
  };

  if (block) {
    return (
      <div className="math-block" style={{ 
        textAlign: 'center', 
        margin: '16px 0',
        fontSize: '1.5rem',
        fontWeight: 500,
        ...renderStyles
      }}>
        {formatMath(math)}
      </div>
    );
  }

  return (
    <span className="math-inline" style={{ 
      fontWeight: 500,
      ...renderStyles
    }}>
      {formatMath(math)}
    </span>
  );
};

// Componentes para mantener compatibilidad
export const InlineMath: React.FC<{ math: string }> = ({ math }) => (
  <MathRenderer math={math} block={false} />
);

export const BlockMath: React.FC<{ math: string }> = ({ math }) => (
  <MathRenderer math={math} block={true} />
);

export default MathRenderer; 