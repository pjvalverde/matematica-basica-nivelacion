import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">Matemática Básica</h3>
            <p className="footer-description">
              Plataforma educativa para estudiantes de educación media 
              que se preparan para ingresar a la universidad.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-link-group">
              <h4>Ejercicios</h4>
              <ul className="footer-link-list">
                <li className="footer-link-item"><a href="#" className="footer-link">Productos Notables</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Orden de Operaciones</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Factorización</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Ecuaciones</a></li>
              </ul>
            </div>
            
            <div className="footer-link-group">
              <h4>Recursos</h4>
              <ul className="footer-link-list">
                <li className="footer-link-item"><a href="#" className="footer-link">Guías de Estudio</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Fórmulas</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Tutoriales</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Glosario</a></li>
              </ul>
            </div>
            
            <div className="footer-link-group">
              <h4>Enlaces</h4>
              <ul className="footer-link-list">
                <li className="footer-link-item"><a href="#" className="footer-link">Acerca de</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Contacto</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Políticas de Privacidad</a></li>
                <li className="footer-link-item"><a href="#" className="footer-link">Términos de Uso</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p className="copyright-text">© 2024 Matemática Básica. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 