import React, { useState, FC } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';

const App: FC = () => {
  const [selectedSection, setSelectedSection] =
    
    
    useState<'login' | 'register' | 'exercises'>('login');
    console.log("selectedSection:", selectedSection);
    const handleRegister = async () => {
        console.log("handleRegister: setSelectedSection('exercises')");
        setSelectedSection('exercises');
    };
    const handleLogin = async () => {
        console.log("handleLogin: setSelectedSection('exercises')");
        setSelectedSection('exercises');
    };
  return (
    <div className="app-container">
        <Header user={null} handleLogout={()=>{}} />
      <div>
        {selectedSection === 'login' && (
            <Login handleLogin={handleLogin} onRegisterClick={() => setSelectedSection('register')} />
        )}
        {selectedSection === 'register' && (
            <Register handleRegister={handleRegister} onLoginClick={() => setSelectedSection('login')} />
        )}
        {selectedSection === 'exercises' && (
          <div>Exercises</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
