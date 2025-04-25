import React, { useState, FormEvent } from 'react';
import './Register.css';


interface RegisterProps {
  handleRegister: (email: string, password: string) => void;
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ handleRegister, onLoginClick }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRegister(email, password);
  };

  return (
    <div className="register-container">

      <div className="register-form-wrapper">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
          <p className='login-option'>

              Already have an account? <button onClick={onLoginClick}>Login</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;