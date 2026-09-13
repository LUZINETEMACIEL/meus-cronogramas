import { useState, useEffect } from 'react';
import { LayoutDashboard, BookOpen, Globe, Plus, Edit3, Trash2, Link as LinkIcon, AlignLeft, GraduationCap, Cross } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('app-cronogramas');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [activeTab, setActiveTab] = useState('Geral');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [taskForm, setTaskForm] = useState({ 
    title: '', category: '', time: '', day: 'Segunda', description: '', link: ''
  });

  useEffect(() => {
    localStorage.setItem('app-cronogramas', JSON.stringify(tasks));
  }, [tasks]);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const menuItems = [
    { id: 'Geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'CTFL', label: 'Foco CTFL', icon: BookOpen },
    { id: 'INGLES', label: 'Inglês B1', icon: Globe },
    { id: 'FACUL', label: 'Faculdade', icon: GraduationCap },
    { id: 'SCJ', label: 'Estudos SCJ', icon: Cross }
  ];

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStartEdit = (task) => {
    setTaskForm({ 
      title: task.title, 
      category: task.category, 
      time: task.time, 
      day: task.day,
      description: task.description || '',
      link: task.link || ''
    });
    setEditingId(task.id);
    setIsAdding(true);
  };

  const handleOpenAddForDay = (dayName) => {
    const defaultCategory = activeTab === 'Geral' ? 'CTFL' : activeTab;
    setTaskForm({ 
      title: '', category: defaultCategory, time: '', day: dayName, description: '', link: ''
    });
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

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'Geral') return true;
    return task.category.toUpperCase().includes(activeTab.toUpperCase());
  });

  return (
    <div className="flex min-h-screen bg-[#FCFBF8] text-stone-800 font-sans selection:bg-[#E8E4D9]">
      <aside className="w-64 border-r border-stone-200 p-8 hidden md:flex flex-col gap-10 bg-[#FCFBF8] fixed h-full">
        <div>
          <h1 className="text-3xl font-serif italic text-stone-800 mb-2 leading-tight">Weekly<br/>Planner</h1>
          <p className="text-xs text-stone-400 tracking-widest uppercase">Estudos & Foco</p>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors ${
                activeTab === item.id 
                  ? 'bg-stone-100/80 text-stone-800 font-medium' 
                  : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-stone-600' : ''} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 ml-0 md:ml-64 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-10 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-2xl font-serif text-stone-800">
                {activeTab === 'Geral' ? 'Semana Completa' : `Foco: ${activeTab}`}
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                {activeTab === 'Geral' ? 'Visão geral de todos os seus estudos' : 'Gerencie os detalhes e links desta matéria'}
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {days.map(day => {
              const dayTasks = filteredTasks.filter(t => t.day === day);
              
              return (
                <div key={day} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-stone-50 flex flex-col min-h-[160px]">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
                    <h3 className="text-sm font-serif tracking-widest text-stone-700 uppercase">{day}</h3>
                    <button onClick={() => handleOpenAddForDay(day)} className="text-stone-300 hover:text-stone-600 transition-colors p-1">
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    {dayTasks.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-sm text-stone-300 italic font-serif">Livre</span>
                      </div>
                    ) : (
                      dayTasks.map(task => (
                        <div key={task.id} className="flex items-start gap-3 group relative bg-stone-50/50 p-4 rounded-xl border border-stone-100/50 hover:border-[#D4C3A3]/30 transition-colors">
                          <button onClick={() => toggleTask(task.id)} className={`mt-1 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-[#D4C3A3] border-[#D4C3A3]' : 'border-stone-300 hover:border-[#D4C3A3]'}`}>
                            {task.completed && <span className="text-white text-[10px]">✓</span>}
                          </button>
                          
                          <div className="flex-1 min-w-0 pr-10">
                            <div className={`flex flex-wrap items-baseline gap-2 ${task.completed ? 'opacity-50' : ''}`}>
                              <span className="text-[10px] font-bold tracking-wider text-stone-400 bg-stone-200/50 px-2 py-0.5 rounded uppercase">{task.category}</span>
                              <span className="text-xs text-stone-400">{task.time}</span>
                            </div>
                            
                            <p className={`text-sm font-medium mt-1 ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>{task.title}</p>

                            {task.description && (
                              <div className="mt-2 flex gap-2 items-start text-stone-500">
                                <AlignLeft size={14} className="mt-0.5 flex-shrink-0 text-stone-400" />
                                <p className="text-xs leading-relaxed whitespace-pre-wrap">{task.description}</p>
                              </div>
                            )}

                            {task.link && (
                              <a href={task.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#b8a27d] hover:text-[#917d5a] transition-colors bg-[#FDFBF7] px-2 py-1 rounded border border-[#E8E4D9]">
                                <LinkIcon size={12} />
                                Acessar material
                              </a>
                            )}
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 absolute right-3 top-3 bg-white/90 rounded px-1 backdrop-blur-sm shadow-sm border border-stone-100">
                            <button onClick={() => handleStartEdit(task)} className="text-stone-400 hover:text-stone-600 p-1.5"><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-stone-400 hover:text-red-400 p-1.5"><Trash2 size={14} /></button>
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

      {isAdding && (
        <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl mb-6 text-stone-800">{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Título do Assunto</label>
                <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm" placeholder="Ex: Cap 2 - Testes Estáticos"/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Categoria</label>
                  <input required type="text" value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm uppercase" placeholder="CTFL, INGLES..."/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Tempo</label>
                  <input required type="text" value={taskForm.time} onChange={e => setTaskForm({...taskForm, time: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm" placeholder="Ex: 1h30"/>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Dia da Semana</label>
                <select value={taskForm.day} onChange={e => setTaskForm({...taskForm, day: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm">
                  {days.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Comentários / Resumo (Opcional)</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm min-h-[80px] resize-none" placeholder="Detalhes do que estudar, dúvidas ou páginas..."/>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Link da Aula/Material (Opcional)</label>
                <input type="url" value={taskForm.link} onChange={e => setTaskForm({...taskForm, link: e.target.value})} className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-100 outline-none focus:border-[#D4C3A3] text-sm" placeholder="https://..."/>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-stone-100">
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