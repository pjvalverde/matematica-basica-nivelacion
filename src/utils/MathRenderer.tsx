import React, { useEffect, useRef } from 'react';
// @ts-ignore
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathProps {
  math: string;
  block?: boolean;
  errorColor?: string;
  renderError?: (error: Error) => React.ReactNode;
}

const MathRenderer: React.FC<MathProps> = ({
  math,
  block = false,
  errorColor,
  renderError,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      katex.render(math, containerRef.current, {
        displayMode: block,
        errorColor,
        throwOnError: !!renderError,
      });
    } catch (error) {
      if (renderError && error instanceof Error) {
        containerRef.current.innerHTML = '';
        const errorNode = document.createElement('span');
        errorNode.textContent = error.message;
        containerRef.current.appendChild(errorNode);
      }
      console.error('Error rendering math expression:', error);
    }
  }, [math, block, errorColor, renderError]);

  return <span ref={containerRef} />;
};

export const InlineMath: React.FC<Omit<MathProps, 'block'>> = (props) => (
  <MathRenderer {...props} block={false} />
);

export const BlockMath: React.FC<Omit<MathProps, 'block'>> = (props) => (
  <div className="math-block">
    <MathRenderer {...props} block={true} />
  </div>
);

export default MathRenderer; 