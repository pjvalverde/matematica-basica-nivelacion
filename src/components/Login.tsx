import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
    handleLogin: (email: string, password: string) => void;
    onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Versión simplificada para el despliegue - omitimos la autenticación con Firebase
      // y simplemente llamamos a handleLogin directamente
      handleLogin(email, password);
    } catch (error: any) {
      setError('Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          <p className="register-option">
            ¿No tienes una cuenta? <button type="button" onClick={onRegisterClick} disabled={loading}>Registrarse</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;