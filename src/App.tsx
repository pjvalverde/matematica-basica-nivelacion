import React, { useState, FC } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import FactorizationExercises from './components/FactorizationExercises';

// Interfaz simplificada para simular un usuario
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

const App: FC = () => {
  const [selectedSection, setSelectedSection] = useState<'login' | 'register' | 'exercises'>('login');
  const [user, setUser] = useState<SimulatedUser | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    // Simulamos crear un usuario
    setUser({ 
      email, 
      emailVerified: false,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      },
      providerData: [],
      uid: Math.random().toString(36).substring(2, 15)
    });
    setSelectedSection('exercises');
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    // Simulamos iniciar sesión
    setUser({ 
      email, 
      emailVerified: false,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      },
      providerData: [],
      uid: Math.random().toString(36).substring(2, 15)
    });
    setSelectedSection('exercises');
    setLoading(false);
  };

  const handleLogout = async () => {
    // Simulamos cerrar sesión
    setUser(null);
    setSelectedSection('login');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-container">
      <Header user={user} handleLogout={handleLogout} />
      <div className="main-content">
        {!user && selectedSection === 'login' && (
          <Login handleLogin={handleLogin} onRegisterClick={() => setSelectedSection('register')} />
        )}
        {!user && selectedSection === 'register' && (
          <Register handleRegister={handleRegister} onLoginClick={() => setSelectedSection('login')} />
        )}
        {(user || selectedSection === 'exercises') && (
          <FactorizationExercises user={user} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
