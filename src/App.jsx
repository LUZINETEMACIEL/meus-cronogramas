import { useState, useEffect } from 'react';
import { Edit3, Trash2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('app-cronogramas');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', category: 'CTFL', time: '', day: 'Segunda' });

  useEffect(() => {
    localStorage.setItem('app-cronogramas', JSON.stringify(tasks));
  }, [tasks]);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStartEdit = (task) => {
    setTaskForm({ title: task.title, category: task.category, time: task.time, day: task.day });
    setEditingId(task.id);
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...taskForm, id: editingId, completed: task.completed } : task
      ));
    } else {
      setTasks([...tasks, { ...taskForm, id: Date.now(), completed: false }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setTaskForm({ title: '', category: 'CTFL', time: '', day: 'Segunda' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-[#E8E4D9]">
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-3xl font-serif text-stone-800 mb-1">Weekly Planner</h1>
            <p className="text-sm text-stone-500 tracking-widest uppercase">Meus Estudos</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-700 transition-colors"
          >
            + Nova Tarefa
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {days.map(day => (
            <div key={day} className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 flex flex-col h-full">
              <h2 className="text-lg font-serif mb-4 pb-2 border-b border-stone-100 text-center tracking-wide">{day}</h2>
              <div className="flex-1 space-y-3">
                {tasks.filter(t => t.day === day).map(task => (
                  <div key={task.id} className="flex items-start gap-3 group relative">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                        ${task.completed ? 'bg-[#D4C3A3] border-[#D4C3A3]' : 'border-stone-300 hover:border-[#D4C3A3]'}`}
                    >
                      {task.completed && <span className="text-white text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0 pr-12">
                      <p className={`text-sm ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                        <span className="font-medium mr-1">[{task.category}]</span> 
                        {task.title}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">{task.time}</p>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute right-0 top-0 bg-white pl-2">
                      <button onClick={() => handleStartEdit(task)} className="text-stone-300 hover:text-stone-600 p-1">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="text-stone-300 hover:text-red-400 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="font-serif text-xl mb-4 text-stone-800">{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Título da Tarefa</label>
                  <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full p-2 rounded-lg border border-stone-200 outline-none focus:border-[#D4C3A3]"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Categoria</label>
                    <input required type="text" value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})} className="w-full p-2 rounded-lg border border-stone-200 outline-none focus:border-[#D4C3A3]" placeholder="Ex: CTFL, Inglês"/>
                  </div>
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">Duração</label>
                    <input required type="text" value={taskForm.time} onChange={e => setTaskForm({...taskForm, time: e.target.value})} className="w-full p-2 rounded-lg border border-stone-200 outline-none focus:border-[#D4C3A3]"/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Dia da Semana</label>
                  <select value={taskForm.day} onChange={e => setTaskForm({...taskForm, day: e.target.value})} className="w-full p-2 rounded-lg border border-stone-200 outline-none focus:border-[#D4C3A3]">
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-stone-500 hover:text-stone-800">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-[#D4C3A3] text-white rounded-lg hover:bg-[#C3B292]">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}