import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Clock } from 'lucide-react';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editStatus, setEditStatus] = useState(task.status);

  const handleUpdate = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      status: editStatus
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }}>
        <input 
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="mb-4"
          placeholder="Task Title"
        />
        <textarea 
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="mb-4"
          placeholder="Task Description"
          rows={3}
        />
        <select 
          value={editStatus} 
          onChange={(e) => setEditStatus(e.target.value)}
          className="mb-4"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            <X size={16} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUpdate}>
            <Check size={16} /> Save
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    'pending': 'var(--text-muted)',
    'in-progress': '#eab308',
    'completed': 'var(--accent)'
  };

  return (
    <div className="glass" style={{ padding: '1.5rem', marginBottom: '1rem', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textDecoration: task.status === 'completed' ? 'line-through' : 'none', opacity: task.status === 'completed' ? 0.7 : 1 }}>
            {task.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', whiteSpace: 'pre-line' }}>{task.description}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => setIsEditing(true)}>
            <Edit2 size={16} />
          </button>
          <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => onDelete(task.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: statusColors[task.status] || 'var(--text-muted)', fontWeight: 500 }}>
        {task.status === 'completed' ? <Check size={14} /> : <Clock size={14} />}
        <span style={{ textTransform: 'capitalize' }}>{task.status?.replace('-', ' ')}</span>
      </div>
    </div>
  );
};

export default TaskCard;
