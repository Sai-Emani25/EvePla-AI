import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Filter,
  Check,
  Tag,
  AlertCircle,
  Building2,
  Utensils,
  Camera,
  Sparkles,
  Shield,
  Smartphone,
} from 'lucide-react';
import { WbsPhase, WbsTask } from '../lib/timeline-wbs';

interface TimelineWbsViewProps {
  phases: WbsPhase[];
  onUpdatePhases: (phases: WbsPhase[]) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Venue: <Building2 className="w-3.5 h-3.5 text-blue-400" />,
  Catering: <Utensils className="w-3.5 h-3.5 text-amber-400" />,
  Decor: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
  Media: <Camera className="w-3.5 h-3.5 text-purple-400" />,
  'Legal/Admin': <Shield className="w-3.5 h-3.5 text-emerald-400" />,
  'Guest/RSVP': <Smartphone className="w-3.5 h-3.5 text-cyan-400" />,
  Tech: <Smartphone className="w-3.5 h-3.5 text-indigo-400" />,
};

export const TimelineWbsView: React.FC<TimelineWbsViewProps> = ({ phases, onUpdatePhases }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(phases[0]?.id || 'phase-6m');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WbsTask['category']>('Venue');
  const [newTaskPriority, setNewTaskPriority] = useState<WbsTask['priority']>('High');

  // Toggle task completed
  const handleToggleTask = (phaseId: string, taskId: string) => {
    const updated = phases.map((phase) => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        };
      }
      return phase;
    });
    onUpdatePhases(updated);
  };

  // Add custom task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const phase = phases.find((p) => p.id === selectedPhaseId);
    const newTask: WbsTask = {
      id: `task-${Date.now()}`,
      phaseId: selectedPhaseId,
      phaseTitle: phase?.title || 'Custom Milestone',
      title: newTaskTitle,
      description: newTaskDesc || 'User defined action item',
      category: newTaskCategory,
      priority: newTaskPriority,
      targetTMinus: phase?.timeframe || 'T-Minus',
      isCompleted: false,
    };

    const updated = phases.map((p) => {
      if (p.id === selectedPhaseId) {
        return {
          ...p,
          tasks: [...p.tasks, newTask],
        };
      }
      return p;
    });

    onUpdatePhases(updated);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  // Calculate overall metrics
  const allTasks = phases.flatMap((p) => p.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.isCompleted).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress & Milestone Overview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Work Breakdown Structure (WBS) & Master Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Chronological readiness checklist spanning T-6 Months down to Day-Of hourly execution
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Milestone Task</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">
              Execution Progress: <strong>{completedTasks}</strong> of <strong>{totalTasks}</strong> tasks completed
            </span>
            <span className="text-emerald-400 font-bold">{completionPercentage}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['all', 'Venue', 'Catering', 'Decor', 'Media', 'Tech', 'Legal/Admin'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Areas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Phases Chronology List */}
      <div className="space-y-5">
        {phases.map((phase, pIndex) => {
          const visibleTasks =
            activeCategory === 'all'
              ? phase.tasks
              : phase.tasks.filter((t) => t.category === activeCategory);

          if (visibleTasks.length === 0 && activeCategory !== 'all') {
            return null;
          }

          const phaseCompleted = phase.tasks.filter((t) => t.isCompleted).length;

          return (
            <div
              key={phase.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                    P{pIndex + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {phase.title}
                      <span className="text-xs font-normal text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {phase.timeframe}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{phase.description}</p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400">
                  <span>
                    {phaseCompleted} / {phase.tasks.length} done
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(phase.id, task.id)}
                    className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                      task.isCompleted
                        ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-slate-400 hover:text-emerald-400 transition">
                        {task.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h5
                          className={`text-sm font-semibold ${
                            task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </h5>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                        {task.assignedVendor && (
                          <span className="inline-block mt-1 text-[11px] font-medium text-indigo-400">
                            Partner: {task.assignedVendor}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                        {CATEGORY_ICONS[task.category] || null}
                        <span>{task.category}</span>
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          task.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h4 className="text-base font-semibold text-white mb-3">Add Custom WBS Task</h4>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Phase</label>
                <select
                  value={selectedPhaseId}
                  onChange={(e) => setSelectedPhaseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {phases.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.timeframe}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Schedule Priest & Muhurtham Coordination"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Detailed notes or requirements"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor">Decor</option>
                    <option value="Media">Media</option>
                    <option value="Tech">Tech</option>
                    <option value="Guest/RSVP">Guest/RSVP</option>
                    <option value="Legal/Admin">Legal/Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500"
                >
                  Add Milestone Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
