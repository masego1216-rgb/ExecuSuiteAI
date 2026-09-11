import {
  Mail,
  Mic,
  CheckSquare,
  AlertCircle,
  Clock,
  Calendar,
  Filter,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/Badges';
import { relativeDate } from '@/utils/helpers';
import { EmptyState } from '@/components/ui/Loading';
import { useState } from 'react';
import type { ActivityCategory } from '@/types';

const categoryFilters: { value: ActivityCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'email', label: 'Emails' },
  { value: 'meeting', label: 'Meetings' },
  { value: 'task', label: 'Tasks' },
  { value: 'deadline', label: 'Deadlines' },
  { value: 'reminder', label: 'Reminders' },
];

export function UpcomingPage() {
  const { activities, setCurrentPage } = useApp();
  const [filter, setFilter] = useState<ActivityCategory | 'all'>('all');

  const filtered = activities.filter((a) => filter === 'all' || a.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  const categoryIcons = {
    email: Mail,
    meeting: Mic,
    task: CheckSquare,
    deadline: AlertCircle,
    reminder: Clock,
  };

  const categoryColors: Record<ActivityCategory, string> = {
    email: 'bg-blue-50 text-blue-600',
    meeting: 'bg-purple-50 text-purple-600',
    task: 'bg-gold-100 text-gold-600',
    deadline: 'bg-red-50 text-red-600',
    reminder: 'bg-green-50 text-green-600',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Filter size={16} className="text-charcoal-400 flex-shrink-0" />
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-charcoal-800 text-cream-50'
                  : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="card p-5">
        {sorted.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming activities"
            description="Your schedule is clear. Generate emails, record meetings, or create tasks to populate this view."
            action={
              <button onClick={() => setCurrentPage('dashboard')} className="btn-secondary text-xs">
                Go to Dashboard
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {sorted.map((activity) => {
              const Icon = categoryIcons[activity.category];
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[activity.category]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-700 truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-charcoal-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {relativeDate(activity.date)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {activity.time}
                      </span>
                      {activity.detail && (
                        <>
                          <span>·</span>
                          <span className="truncate">{activity.detail}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={activity.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
