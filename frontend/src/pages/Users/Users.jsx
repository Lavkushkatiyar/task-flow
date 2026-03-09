import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import { Trash2, Shield, User, ShieldCheck, ShieldOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Extra guard though route is protected
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsersList(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All their tasks will be lost.')) return;

    setError('');
    setActionMsg('');
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const label = newRole === 'admin' ? 'promote' : 'demote';

    if (!window.confirm(`Are you sure you want to ${label} "${targetUser.id}" to ${newRole}?`)) return;

    setError('');
    setActionMsg('');
    try {
      await api.put(`/users/${targetUser.id}/role`, { role: newRole });
      setActionMsg(`"${targetUser.id}" is now ${newRole}.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${label} user`);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem' }} className="flex-center gap-2">
          <Shield className="text-gradient" size={24} />
          User Management
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 glass" style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', color: '#f87171' }}>
          {error}
        </div>
      )}
      {actionMsg && (
        <div className="mb-4 p-3 glass" style={{ background: 'rgba(139, 92, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--primary)' }}>
          ✓ {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="flex-center animate-pulse py-8">Loading users...</div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>User ID</div>
            <div>Role</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {usersList.length === 0 ? (
              <div className="flex-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                No users found.
              </div>
            ) : (
              usersList.map((mUser) => (
                <div
                  key={mUser.id}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}
                >
                  {/* User ID column */}
                  <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem' }}>
                    {mUser.role === 'admin'
                      ? <Shield size={16} style={{ color: 'var(--primary)' }} />
                      : <User size={16} className="text-muted" />}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{mUser.id}</span>
                    {user.id === mUser.id && (
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: 'var(--primary)', borderRadius: '1rem', marginLeft: '0.25rem', opacity: 0.85 }}>
                        You
                      </span>
                    )}
                  </div>

                  {/* Role column */}
                  <div style={{ textTransform: 'capitalize', color: mUser.role === 'admin' ? 'var(--primary)' : 'var(--text-main)', fontWeight: mUser.role === 'admin' ? '600' : '400' }}>
                    {mUser.role}
                  </div>

                  {/* Actions column */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {/* Promote / Demote toggle */}
                    <button
                      className={mUser.role === 'admin' ? 'btn' : 'btn btn-primary'}
                      style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        opacity: user.id === mUser.id ? 0.35 : 1,
                        cursor: user.id === mUser.id ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => handleToggleRole(mUser)}
                      disabled={user.id === mUser.id}
                      title={user.id === mUser.id ? 'Cannot change your own role' : mUser.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                    >
                      {mUser.role === 'admin'
                        ? <><ShieldOff size={14} /> Demote</>
                        : <><ShieldCheck size={14} /> Promote</>}
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-danger"
                      style={{
                        padding: '0.4rem 0.6rem',
                        opacity: user.id === mUser.id ? 0.35 : 1,
                        cursor: user.id === mUser.id ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => handleDeleteUser(mUser.id)}
                      disabled={user.id === mUser.id}
                      title={user.id === mUser.id ? 'Cannot delete yourself' : 'Delete user'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
