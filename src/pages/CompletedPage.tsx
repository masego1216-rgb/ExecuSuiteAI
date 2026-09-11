import { Mail, Mic, CheckSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { relativeDate } from '@/utils/helpers';
import { EmptyState } from '@/components/ui/Loading';

export function CompletedPage() {
  const { tasks, meetings, generatedEmails } = useApp();

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedMeetings = meetings;
  const completedEmails = generatedEmails;

  const stats = [
    { label: 'Tasks Completed', value: completedTasks.length, icon: CheckSquare, color: 'bg-green-50 text-green-600' },
    { label: 'Meetings Summarized', value: completedMeetings.length, icon: Mic, color: 'bg-purple-50 text-purple-600' },
    { label: 'Emails Generated', value: completedEmails.length, icon: Mail, color: 'bg-blue-50 text-blue-600' },
  ];

  const hasAny = completedTasks.length > 0 || completedMeetings.length > 0 || completedEmails.length > 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-charcoal-800">{stat.value}</p>
                  <p className="text-xs text-charcoal-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Tasks */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
          <h3 className="font-semibold text-charcoal-800">Completed Tasks</h3>
          <span className="badge bg-green-50 text-green-700">{completedTasks.length}</span>
        </div>
        {completedTasks.length === 0 ? (
          <p className="text-sm text-charcoal-400 py-6 text-center">No completed tasks yet.</p>
        ) : (
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal-600 line-through">{task.title}</p>
                  <p className="text-xs text-charcoal-400">{relativeDate(task.dueDate)} · {task.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Meetings */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Mic size={18} className="text-purple-600" />
          </div>
          <h3 className="font-semibold text-charcoal-800">Processed Meetings</h3>
          <span className="badge bg-purple-50 text-purple-700">{completedMeetings.length}</span>
        </div>
        {completedMeetings.length === 0 ? (
          <p className="text-sm text-charcoal-400 py-6 text-center">No meetings processed yet.</p>
        ) : (
          <div className="space-y-2">
            {completedMeetings.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <Mic size={16} className="text-charcoal-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700">{m.title}</p>
                  <p className="text-xs text-charcoal-400">
                    {relativeDate(m.date)} · {m.duration} · {m.actionItems.length} action items
                  </p>
                </div>
                <span className="badge bg-green-50 text-green-700">
                  {m.actionItems.filter((a) => a.done).length}/{m.actionItems.length} done
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generated Emails */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Mail size={18} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-charcoal-800">Generated Emails</h3>
          <span className="badge bg-blue-50 text-blue-700">{completedEmails.length}</span>
        </div>
        {completedEmails.length === 0 ? (
          <p className="text-sm text-charcoal-400 py-6 text-center">No emails generated yet.</p>
        ) : (
          <div className="space-y-2">
            {completedEmails.map((email) => (
              <div key={email.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <Mail size={16} className="text-charcoal-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{email.subject}</p>
                  <p className="text-xs text-charcoal-400">To: {email.recipient} · {email.tone} tone</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!hasAny && (
        <div className="card p-5">
          <EmptyState
            icon={CheckCircle2}
            title="Nothing completed yet"
            description="Start using ExecuSuite AI tools to see your completed work here."
          />
        </div>
      )}
    </div>
  );
}
