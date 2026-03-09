import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/app_logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div className="flex-center gap-2">
        <img src={appLogo} alt="TaskFlow Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }} />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="text-gradient">TaskFlow</span>
      </div>
      
      <div className="flex-center" style={{ gap: '1.5rem' }}>
        {user?.role === 'admin' && (
          <Link to="/users" className="auth-link" style={{ fontSize: '0.875rem' }}>Manage Users</Link>
        )}
        
        <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <UserIcon size={16} />
          <span>{user?.email}</span>
        </div>
        
        <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
