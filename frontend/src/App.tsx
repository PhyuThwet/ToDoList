import React, { useState, useEffect } from 'react';
import './App.css';


interface Task {
  id: number;
  title: string;
  category: string;
  deadline: string;
  is_completed: boolean;
}

type Screen = 'list' | 'form';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('list');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Job');
  const [deadline, setDeadline] = useState('');

  
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/index.php?action=list');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = async () => {
    if (!title || !deadline) {
      alert('Title and Deadline are required!');
      return;
    }

    const payload = {
      id: editingTask?.id,
      title,
      category,
      deadline,
      is_completed: editingTask?.is_completed || false
    };

    try {
      await fetch('/api/index.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setScreen('list');
      setEditingTask(null);
      setTitle('');
      setCategory('Job');
      setDeadline('');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await fetch('/api/index.php?action=toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, isComplete: !task.is_completed })
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setDeadline(task.deadline);
    setScreen('form');
  };

  const openAddForm = () => {
    setEditingTask(null);
    setTitle('');
    setCategory('Job');
    setDeadline('');
    setScreen('form');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'incomplete') return !task.is_completed;
    if (filter === 'complete') return task.is_completed;
    return true;
  });

  return (
    <div className="app-container">
      {screen === 'list' ? (
        <>
          <h1>My Tasks</h1>
          <button className="btn add-btn" onClick={openAddForm}>+Add</button>
          
          <div className="tabs">
            <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL</button>
            <button className={`tab-btn ${filter === 'incomplete' ? 'active' : ''}`} onClick={() => setFilter('incomplete')}>Incomplete</button>
            <button className={`tab-btn ${filter === 'complete' ? 'active' : ''}`} onClick={() => setFilter('complete')}>Complete</button>
          </div>

          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={task.is_completed} 
                  onChange={() => toggleComplete(task)} 
                />
                <div className="task-info" onClick={() => openEditForm(task)}>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">category: {task.category} | deadline: {task.deadline}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Add a Task</h2>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Job">Job</option>
              <option value="Private">Private</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setScreen('list')}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;


