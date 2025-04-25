import React from 'react';
import './Header.css';
import { User } from 'firebase/auth';

interface HeaderProps {
  user: User | null;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-section">
          <a href="/" className="header-logo">
            <span className="header-logo-text">Matemática Básica</span>
          </a>

          <div className="header-nav">
            <a href="#" className="nav-link">Inicio</a>
            {user && (
              <>
                <a href="#" className="nav-link">Ejercicios</a>
                <a href="#" className="nav-link">Factorización</a>
                <a href="#" className="nav-link">Productos Notables</a>
              </>
            )}
          </div>
        </div>

        <div className="header-user-section">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-email">{user.email}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <span className="auth-message">Inicia sesión para acceder a los ejercicios</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 