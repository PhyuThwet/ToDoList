import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  category: string;
  deadline: string;
  is_completed: number; 
}

type Screen = 'list' | 'form';
type Filter = 'all' | 'incomplete' | 'complete';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('list');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Job');
  const [deadline, setDeadline] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/index.php?action=list');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const backToList = () => {
    setScreen('list');
    setEditingTask(null);
    setTitle('');
    setCategory('Job');
    setDeadline('');
  };

  const handleSave = async () => {
    if (!title || !deadline) {
      alert('Title and Deadline are required!');
      return;
    }
    const payload = {
      id: editingTask?.id ?? null,
      title,
      category,
      deadline,
      is_completed: editingTask ? editingTask.is_completed : 0
    };

    try {
      const res = await fetch('/api/index.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      backToList();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      const res = await fetch('/api/index.php?action=toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          isComplete: task.is_completed ? 0 : 1
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      const res = await fetch('/api/index.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
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

  const getToday= ()=> {
    const t= new Date();
    const y= t.getFullYear();
    const m= String (t.getMonth() + 1).padStart(2,'0');
    const d= String(t.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }

  const formatDeadline = (deadline: string) => {
    if (!deadline) return '';
    const today = new Date();
    today.setHours(0, 0, 0);
    const d = new Date(`${deadline}T00:00:00`);
    const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return deadline.replace(/-/g, '/');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'incomplete') return !task.is_completed;
    return !!task.is_completed;
  });

  return (
    <div className="app-container">
      {screen === 'list' ? (
        <>
          <div className="list-header">
            <h1>Tasks List</h1>
          </div>

          <div className="tabs">
            <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`tab-btn ${filter === 'incomplete' ? 'active' : ''}`} onClick={() => setFilter('incomplete')}>uncomplete</button>
            <button className={`tab-btn ${filter === 'complete' ? 'active' : ''}`} onClick={() => setFilter('complete')}>complete</button>
          </div>

          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task.id} className={`task-item ${task.is_completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!task.is_completed}
                  disabled={!!task.is_completed}
                  onChange={() => toggleComplete(task)}
                />
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                </div>
                <span className="deadline-badge">
                  {task.is_completed ? 'done' : formatDeadline(task.deadline)}
                </span>

                {!task.is_completed ? (
                  <>
                    <button
                      className="btn btn-edit"
                      onClick={() => openEditForm(task)}
                    >edit</button>
                    <button
                      className="btn btn-cancle"
                      onClick={() => deleteTask(task)}
                    >cancel</button>
                  </>
                ) : (
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteTask(task)}
                  >delete</button>
                )}
              </li>
            ))}
          </ul>

          <button className="add-btn-bottom" onClick={openAddForm}>+ADD</button>
        </>
      ) : (
        <div className="form-card">
          <div className="form-header">
            <h2>{editingTask ? 'Edit' : 'Add'}</h2>
            <button className="close-btn" onClick={backToList}> x </button>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="eg:meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Job">job</option>
              <option value="Private">private</option>
              <option value="Other">other</option>
            </select>
          </div>

          <div className="form-group">
            <label>deadline</label>
            <input
              type="date"
              min={getToday()}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="btn btn-cancle" onClick={backToList}>cancel</button>
            <button className="btn btn-save" onClick={handleSave}>save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;