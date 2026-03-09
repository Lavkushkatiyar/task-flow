import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import TaskCard from '../../components/TaskCard';
import api from '../../services/api';
import { Plus } from 'lucide-react';
import dashboardBanner from '../../assets/dashboard_banner.png';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New Task Form State
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    try {
      await api.post('/tasks', {
        title: newTitle,
        description: newDescription
      });
      
      setNewTitle('');
      setNewDescription('');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      await api.put(`/tasks/${id}`, updatedData);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <Navbar />
      
      <div className="glass" style={{
        backgroundImage: `url(${dashboardBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,23,42,0.95), rgba(139, 92, 246, 0.2))' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.2, fontWeight: 700 }} className="text-gradient">Welcome to TaskFlow</h1>
          <p style={{ color: 'var(--text-main)', opacity: 0.9, maxWidth: '500px', fontSize: '1.1rem' }}>Manage your projects effortlessly with our futuristic task management dashboard.</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem' }}>My Tasks</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>
      
      {error && <div className="error-text mb-4 p-3 glass" style={{background: 'rgba(239, 68, 68, 0.1)'}}>{error}</div>}
      
      {showForm && (
        <form onSubmit={handleCreateTask} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 className="mb-4">Create New Task</h3>
          <div className="form-group">
            <input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="form-group">
            <textarea 
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add details (optional)"
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Task</button>
        </form>
      )}

      {loading ? (
        <div className="flex-center animate-pulse py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="glass flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
          <p>No tasks found. Get started by creating one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
