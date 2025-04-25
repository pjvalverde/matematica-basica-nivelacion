import React, { useState, useEffect } from 'react';
import { getTopUsers, getUserProfile, UserProfile } from '../firebase/userService';
import './Leaderboard.css';

interface LeaderboardProps {
  currentUserId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Obtener el top 10 de usuarios
        const topUsers = await getTopUsers(10);
        setUsers(topUsers);
        
        // Si hay un usuario actual, obtener su perfil para mostrar
        if (currentUserId) {
          const userProfile = await getUserProfile(currentUserId);
          setCurrentUserProfile(userProfile);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el ranking:", error);
        setError("Ocurrió un error al cargar el ranking. Por favor, intenta de nuevo más tarde.");
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [currentUserId]);
  
  // Formatear la fecha para mostrarla de forma legible
  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    
    if (date && typeof date.toDate === 'function') {
      // Para timestamps de Firestore
      date = date.toDate();
    } else if (!(date instanceof Date)) {
      // Para cadenas ISO o timestamps
      date = new Date(date);
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="leaderboard-loading">Cargando ranking...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Ranking de Estudiantes</h2>
      
      {currentUserProfile && !users.some(user => user.uid === currentUserProfile.uid) && (
        <div className="your-position">
          <h3>Tu posición</h3>
          <div className="your-stats">
            <div className="rank-number">{currentUserProfile.rank || '-'}</div>
            <div className="user-info">
              <span className="user-name">{currentUserProfile.displayName || currentUserProfile.email}</span>
              <span className="user-email">{currentUserProfile.email}</span>
            </div>
            <div className="user-coins">{currentUserProfile.totalCoins} monedas</div>
            <div className="user-exercises">{currentUserProfile.exercisesCompleted} ejercicios</div>
          </div>
        </div>
      )}
      
      <div className="top-users">
        <h3>Top 10 Estudiantes</h3>
        
        {users.length === 0 ? (
          <p className="no-users">Aún no hay usuarios en el ranking. ¡Sé el primero en resolver ejercicios!</p>
        ) : (
          <div className="users-list">
            <div className="user-header">
              <div className="rank-column">Rank</div>
              <div className="name-column">Nombre</div>
              <div className="coins-column">Monedas</div>
              <div className="exercises-column">Ejercicios</div>
              <div className="active-column">Última actividad</div>
            </div>
            
            {users.map((user) => (
              <div 
                key={user.uid} 
                className={`user-row ${currentUserId === user.uid ? 'current-user' : ''}`}
              >
                <div className="rank-column">
                  {user.rank === 1 && <span className="gold-medal">🥇</span>}
                  {user.rank === 2 && <span className="silver-medal">🥈</span>}
                  {user.rank === 3 && <span className="bronze-medal">🥉</span>}
                  {user.rank && user.rank > 3 && <span className="rank-number">{user.rank}</span>}
                </div>
                
                <div className="name-column">
                  <span className="user-name">{user.displayName || 'Usuario'}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                
                <div className="coins-column">{user.totalCoins}</div>
                
                <div className="exercises-column">{user.exercisesCompleted}</div>
                
                <div className="active-column">{formatDate(user.lastActive)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 