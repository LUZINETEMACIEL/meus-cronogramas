import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Globe, Plus, Edit3, Trash2 } from 'lucide-react';

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

  const handleOpenAddForDay = (dayName) => {
    setTaskForm({ title: '', category: 'CTFL', time: '', day: dayName });
    setEditingId(null);
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
  };

  return (
    <div className="flex min-h-screen bg-[#FCFBF8] text-stone-800 font-sans selection:bg-[#E8E4D9]">
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-64 border-r border-stone-200 p-8 hidden md:flex flex-col gap-10 bg-[#FCFBF8]">
        <div>
          <h1 className="text-3xl font-serif italic text-stone-800 mb-2 leading-tight">Weekly<br/>Planner</h1>
          <p className="text-xs text-stone-400 tracking-widest uppercase">Estudos & Foco</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 w-full p-3 bg-stone-100/80 rounded-xl text-stone-800 font-medium transition-colors">
            <LayoutDashboard size={18} className="text-stone-600" />
            <span className="text-sm">Visão Geral</span>
          </button>
          
          <button className="flex items-center gap-3 w-full p-3 text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">
            <BookOpen size={18} />
            <span className="text-sm">Foco CTFL</span>
          </button>

          <button className="flex items-center gap-3 w-full p-3 text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">
            <Globe size={18} />
            <span className="text-sm">Inglês B1</span>
          </button>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-serif text-stone-800">Semana Completa</h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {days.map(day => {
              const dayTasks = tasks.filter(t => t.day === day);
              
              return (
                <div key={day} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-stone-50 flex flex-col min-h-[160px]">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
                    <h3 className="text-sm font-serif tracking-widest text-stone-700 uppercase">{day}</h3>
                    <button 
                      onClick={() => handleOpenAddForDay(day)}
                      className="text-stone-300 hover:text-stone-600 transition-colors p-1"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    {dayTasks.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-sm text-stone-300 italic font-serif">Livre</span>
                      </div>
                    ) : (
                      dayTasks.map(task => (
                        <div key={task.id} className="flex items-start gap-3 group relative bg-stone-50/50 p-2 rounded-lg">
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                              ${task.completed ? 'bg-[#D4C3A3] border-[#D4C3A3]' : 'border-stone-300 hover:border-[#D4C3A3]'}`}
                          >
                            {task.completed && <span className="text-white text-[10px]">✓</span>}
                          </button>
                          
                          <div className="flex-1 min-w-0 pr-12">
                            <p className={`text-sm ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                              <span className="font-medium mr-1">[{task.category}]</span> 
                              {task.title}
                            </p>
                            <p className="text-xs text-stone-400 mt-0.5">{task.time}</p>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute right-2 top-2 bg-white/80 rounded px-1 backdrop-blur-sm">
                            <button onClick={() => handleStartEdit(task)} className="text-stone-400 hover:text-stone-600 p-1">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-stone-400 hover:text-red-400 p-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Adicionar/Editar */}
      {isAdding && (
        <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-serif text-xl mb-6 text-stone-800">{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Título</label>
                <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Categoria</label>
                  <input required type="text" value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm" placeholder="Ex: CTFL"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Tempo</label>
                  <input required type="text" value={taskForm.time} onChange={e => setTaskForm({...taskForm, time: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm"/>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Dia</label>
                <select value={taskForm.day} onChange={e => setTaskForm({...taskForm, day: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm">
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800">Cancelar</button>
                <button type="submit" className="px-6 py-2 text-sm bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}