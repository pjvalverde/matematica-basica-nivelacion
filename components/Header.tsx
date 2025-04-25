import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-section">
          <a href="/" className="header-logo">
            <span className="header-logo-text">Matemática Básica</span>
          </a>
          
          <div className="header-nav">
            <a href="#" className="nav-link">Inicio</a>
            <a href="#" className="nav-link">Ejercicios</a>
            <a href="#" className="nav-link">Recursos</a>
            <a href="#" className="nav-link">Ayuda</a>
          </div>
        </div>
        
        <div>
          <button className="login-button">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 