import { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Check,
  CalendarClock,
  Lightbulb,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { planTasks, getSmartSuggestions } from '@/utils/taskPlanner';
import { uid, todayISO, relativeDate } from '@/utils/helpers';
import { PriorityBadge, TaskStatusBadge } from '@/components/ui/Badges';
import { AIGenerating, EmptyState } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import type { Task, TaskPriority, TaskStatus } from '@/types';

const priorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const allPriorities = ['Emails', 'Meetings', 'Deep Work', 'Project Work', 'Admin', 'Review'];

export function ExecuPlannerPage() {
  const { tasks, addTask, addTasks, updateTask, deleteTask, toggleTaskComplete, showToast } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Add task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(todayISO());
  const [dueTime, setDueTime] = useState('12:00');
  const [category, setCategory] = useState('General');

  // Plan form
  const [planGoal, setPlanGoal] = useState('');
  const [planDate, setPlanDate] = useState(todayISO());
  const [planPriorities, setPlanPriorities] = useState<string[]>([]);
  const [planHours, setPlanHours] = useState(8);

  const handleAddTask = () => {
    if (!title.trim()) {
      showToast('warning', 'Please enter a task title.');
      return;
    }
    const task: Task = {
      id: uid('task'),
      title,
      description,
      priority,
      status: 'todo',
      dueDate,
      dueTime,
      category,
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    };
    addTask(task);
    setShowAdd(false);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(todayISO());
    setDueTime('12:00');
    setCategory('General');
    showToast('success', 'Task created successfully.');
  };

  const handlePlanDay = () => {
    if (!planGoal.trim()) {
      showToast('warning', 'Please describe your main goal for the day.');
      return;
    }
    setPlanning(true);
    setTimeout(() => {
      const planned = planTasks({
        goal: planGoal,
        date: planDate,
        priorities: planPriorities,
        availableHours: planHours,
      });
      addTasks(planned);
      const smartSuggestions = getSmartSuggestions([...planned, ...tasks]);
      setSuggestions(smartSuggestions);
      setPlanning(false);
      setShowPlan(false);
      showToast('success', `AI planned ${planned.length} tasks for your day!`);
    }, 2000);
  };

  const togglePlanPriority = (p: string) => {
    setPlanPriorities((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const statusOrder = { 'in-progress': 0, todo: 1, completed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.dueTime.localeCompare(b.dueTime);
  });

  const todayTasks = sortedTasks.filter((t) => t.dueDate === todayISO());
  const otherTasks = sortedTasks.filter((t) => t.dueDate !== todayISO());

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className={`card p-4 group ${task.status === 'completed' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
            task.status === 'completed'
              ? 'bg-green-500 text-white'
              : 'border-2 border-cream-300 hover:border-gold-400'
          }`}
        >
          {task.status === 'completed' && <Check size={12} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-charcoal-400' : 'text-charcoal-800'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-charcoal-400 mt-0.5 line-clamp-2">{task.description}</p>
              )}
            </div>
            {task.aiSuggested && (
              <span className="badge bg-gold-100 text-gold-700 flex-shrink-0">
                <Sparkles size={10} /> AI
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <span className="badge bg-cream-100 text-charcoal-500">{task.category}</span>
            <span className="text-xs text-charcoal-400 flex items-center gap-1">
              <Calendar size={12} /> {relativeDate(task.dueDate)}
            </span>
            <span className="text-xs text-charcoal-400 flex items-center gap-1">
              <Clock size={12} /> {task.dueTime}
            </span>
          </div>
          {task.status !== 'completed' && (
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                className="text-xs px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-charcoal-600 cursor-pointer outline-none focus:border-gold-300"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                className="text-xs px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-charcoal-600 cursor-pointer outline-none focus:border-gold-300"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  deleteTask(task.id);
                  showToast('info', 'Task deleted.');
                }}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setShowAdd(true)} className="btn-primary flex-1 sm:flex-none">
          <Plus size={18} /> Create Task
        </button>
        <button onClick={() => setShowPlan(true)} className="btn-gold flex-1 sm:flex-none">
          <CalendarClock size={18} /> Plan My Day with AI
        </button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="card p-5 bg-gradient-to-br from-gold-50 to-cream-50 border-gold-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-gold-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-800 text-sm mb-2">AI Smart Suggestions</h3>
              <div className="space-y-1.5">
                {suggestions.map((s, i) => (
                  <p key={i} className="text-xs text-charcoal-600 flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setSuggestions([])}
                className="mt-2 text-xs text-charcoal-400 hover:text-charcoal-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-charcoal-800">Today's Tasks</h3>
          <span className="text-xs text-charcoal-400">
            {todayTasks.filter((t) => t.status !== 'completed').length} remaining
          </span>
        </div>
        {todayTasks.length === 0 ? (
          <div className="card p-5">
            <EmptyState
              icon={CheckSquare}
              title="No tasks for today"
              description="Create a task or let AI plan your day with smart suggestions."
              action={
                <div className="flex gap-2">
                  <button onClick={() => setShowAdd(true)} className="btn-secondary text-xs">
                    <Plus size={14} /> Add Task
                  </button>
                  <button onClick={() => setShowPlan(true)} className="btn-gold text-xs">
                    <Sparkles size={14} /> Plan My Day
                  </button>
                </div>
              }
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {todayTasks.map(renderTaskCard)}
          </div>
        )}
      </div>

      {/* Other Tasks */}
      {otherTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-charcoal-800">Upcoming & Past Tasks</h3>
            <span className="text-xs text-charcoal-400">{otherTasks.length} tasks</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {otherTasks.map(renderTaskCard)}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Create New Task"
        subtitle="Add a task to your schedule"
        footer={
          <>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddTask} className="btn-primary">
              <Check size={16} /> Create Task
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prepare quarterly report"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task..."
              className="input-field min-h-[80px] resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field cursor-pointer"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Project"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Due Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Plan My Day Modal */}
      <Modal
        open={showPlan}
        onClose={() => setShowPlan(false)}
        title="Plan My Day with AI"
        subtitle="Let AI create an optimized schedule for you"
        maxWidth="max-w-xl"
        footer={
          <>
            <button onClick={() => setShowPlan(false)} className="btn-secondary">Cancel</button>
            <button onClick={handlePlanDay} disabled={planning} className="btn-gold">
              <Sparkles size={16} /> {planning ? 'Planning...' : 'Generate Plan'}
            </button>
          </>
        }
      >
        {planning ? (
          <AIGenerating label="AI is creating your optimal schedule..." />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">
                What is your main goal for the day?
              </label>
              <textarea
                value={planGoal}
                onChange={(e) => setPlanGoal(e.target.value)}
                placeholder="e.g., Finish the quarterly report, prepare for the client meeting, and review team progress"
                className="input-field min-h-[80px] resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Available Hours</label>
                <select
                  value={planHours}
                  onChange={(e) => setPlanHours(Number(e.target.value))}
                  className="input-field cursor-pointer"
                >
                  <option value={4}>4 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={8}>8 hours (Full day)</option>
                  <option value={10}>10 hours</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-2">Focus Areas (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {allPriorities.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlanPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      planPriorities.includes(p)
                        ? 'bg-charcoal-800 text-cream-50'
                        : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
                    }`}
                  >
                    {planPriorities.includes(p) && <X size={12} className="inline mr-1" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
