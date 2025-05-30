import React, { useState, FC, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import FactorizationExercises from './components/FactorizationExercises';
import RationalFractionsExercises from './components/RationalFractionsExercises';
import EquationsExercises from './components/EquationsExercises';
import CombinedProblems from './components/CombinedProblems';
import Leaderboard from './components/Leaderboard';
import { registerUser, loginUser, logoutUser, getCurrentUser, onUserChange } from './firebase/authService';
import { User } from 'firebase/auth';

// Tipo para las secciones disponibles en la aplicación
type SectionType = 'login' | 'register' | 'exercises' | 'rationalfractions' | 'equations' | 'combinedproblems' | 'leaderboard';

const App: FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar cambios de autenticación al cargar la app
  useEffect(() => {
    const unsubscribe = onUserChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      if (authUser && selectedSection === 'login') {
        setSelectedSection('exercises');
      }
    });
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [selectedSection]);

  const handleRegister = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Registrar usuario con Firebase
      await registerUser(email, password, displayName);
      
      // Después del registro exitoso, cambiar a sección de ejercicios
      setSelectedSection('exercises');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Iniciar sesión con Firebase
      await loginUser(email, password);
      
      // Después del inicio de sesión exitoso, cambiar a sección de ejercicios
      setSelectedSection('exercises');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Cerrar sesión con Firebase
      await logoutUser();
      
      // Después del cierre de sesión, volver a la pantalla de login
      setSelectedSection('login');
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar entre secciones
  const navigateTo = (section: SectionType) => {
    setSelectedSection(section);
  };

  if (loading && !user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-container">
      <Header 
        user={user} 
        handleLogout={handleLogout} 
        currentSection={selectedSection}
        onNavigate={navigateTo}
      />
      <div className="main-content">
        {error && <div className="error-message">{error}</div>}
        
        {!user && selectedSection === 'login' && (
          <Login 
            handleLogin={handleLogin} 
            onRegisterClick={() => setSelectedSection('register')} 
          />
        )}
        
        {!user && selectedSection === 'register' && (
          <Register 
            handleRegister={handleRegister} 
            onLoginClick={() => setSelectedSection('login')} 
          />
        )}
        
        {user && selectedSection === 'exercises' && (
          <FactorizationExercises user={user} />
        )}
        
        {user && selectedSection === 'rationalfractions' && (
          <RationalFractionsExercises user={user} />
        )}
        
        {user && selectedSection === 'equations' && (
          <EquationsExercises user={user} />
        )}
        
        {user && selectedSection === 'combinedproblems' && (
          <CombinedProblems user={user} />
        )}
        
        {user && selectedSection === 'leaderboard' && (
          <Leaderboard currentUserId={user.uid} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
