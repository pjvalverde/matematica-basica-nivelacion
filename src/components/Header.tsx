import React from 'react';
import './Header.css';
import { User } from 'firebase/auth';

// Define our own user interface instead of importing from firebase
interface SimulatedUser {
  email: string;
  displayName?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: any[];
  uid: string;
}

interface HeaderProps {
  user: User | null;
  handleLogout: () => void;
  currentSection: string;
  onNavigate: (section: 'login' | 'register' | 'exercises' | 'leaderboard') => void;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout, currentSection, onNavigate }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo-section">
          <a 
            href="#" 
            className="header-logo"
            onClick={(e) => {
              e.preventDefault();
              user ? onNavigate('exercises') : onNavigate('login');
            }}
          >
            <span className="header-logo-text">Matemática Básica</span>
          </a>

          <div className="header-nav">
            <a 
              href="#" 
              className={`nav-link ${currentSection === 'exercises' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('exercises');
              }}
            >
              Inicio
            </a>
            {user && (
              <>
                <a 
                  href="#" 
                  className={`nav-link ${currentSection === 'exercises' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('exercises');
                  }}
                >
                  Ejercicios
                </a>
                <a 
                  href="#" 
                  className={`nav-link ${currentSection === 'leaderboard' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('leaderboard');
                  }}
                >
                  Ranking
                </a>
              </>
            )}
          </div>
        </div>

        <div className="header-user-section">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{user.displayName || 'Usuario'}</span>
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