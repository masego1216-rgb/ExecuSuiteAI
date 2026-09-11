import {
  Mail,
  Mic,
  CheckSquare,
  TrendingUp,
  ArrowRight,
  CalendarClock,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/ui/Badges';
import { relativeDate } from '@/utils/helpers';
import type { PageId } from '@/types';

export function DashboardPage() {
  const { user, setCurrentPage, generatedEmails, scheduledEmails, meetings, tasks, activities } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const emailsToday = generatedEmails.filter((e) => e.createdAt.startsWith(todayStr)).length;
  const scheduledEmailCount = scheduledEmails.filter((e) => e.status === 'scheduled').length;
  const draftCount = generatedEmails.length;
  const meetingsProcessed = meetings.length;
  const totalActionItems = meetings.reduce((acc, m) => acc + m.actionItems.length, 0);
  const pendingActionItems = meetings.reduce((acc, m) => acc + m.actionItems.filter((a) => !a.done).length, 0);
  const tasksToday = tasks.filter((t) => t.dueDate === todayStr);
  const tasksDueToday = tasksToday.filter((t) => t.status !== 'completed').length;
  const tasksCompleted = tasks.filter((t) => t.status === 'completed').length;
  const upcomingDeadlines = tasks.filter((t) => t.status !== 'completed' && t.dueDate > todayStr).length;

  const summaryCards = [
    {
      title: 'Emails',
      icon: Mail,
      stats: [
        { label: 'Generated today', value: emailsToday },
        { label: 'Scheduled', value: scheduledEmailCount },
        { label: 'Drafts', value: draftCount },
      ],
      color: 'from-blue-50 to-blue-100/50',
      iconColor: 'text-blue-600',
      page: 'execumail' as PageId,
    },
    {
      title: 'Meetings',
      icon: Mic,
      stats: [
        { label: 'Processed', value: meetingsProcessed },
        { label: 'Summaries', value: meetingsProcessed },
        { label: 'Pending actions', value: pendingActionItems },
      ],
      color: 'from-purple-50 to-purple-100/30',
      iconColor: 'text-charcoal-600',
      page: 'execurizer' as PageId,
    },
    {
      title: 'Tasks',
      icon: CheckSquare,
      stats: [
        { label: 'Due today', value: tasksDueToday },
        { label: 'Completed', value: tasksCompleted },
        { label: 'Upcoming deadlines', value: upcomingDeadlines },
      ],
      color: 'from-gold-100 to-gold-200/50',
      iconColor: 'text-gold-600',
      page: 'execuplanner' as PageId,
    },
    {
      title: 'Productivity',
      icon: TrendingUp,
      stats: [
        { label: 'Tasks completed', value: tasksCompleted },
        { label: 'Meetings summarized', value: meetingsProcessed },
        { label: 'Emails generated', value: generatedEmails.length },
      ],
      color: 'from-green-50 to-green-100/50',
      iconColor: 'text-green-600',
      page: 'completed' as PageId,
    },
  ];

  const quickActions = [
    { label: 'Generate Email', icon: Mail, desc: 'Write a professional email with AI', page: 'execumail' as PageId },
    { label: 'Start Transcription', icon: Mic, desc: 'Record and summarize a meeting', page: 'execurizer' as PageId },
    { label: 'Create Task', icon: CheckSquare, desc: 'Add a new task to your list', page: 'execuplanner' as PageId },
    { label: 'Plan My Day', icon: CalendarClock, desc: 'Let AI plan your schedule', page: 'execuplanner' as PageId },
  ];

  const upcomingActivities = activities
    .filter((a) => a.status !== 'completed')
    .slice(0, 6);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => setCurrentPage(card.page)}
              className="card card-hover p-5 text-left group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
                <ArrowRight size={16} className="text-charcoal-300 group-hover:text-charcoal-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-medium text-charcoal-400 mb-3">{card.title}</h3>
              <div className="space-y-2">
                {card.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-charcoal-400">{stat.label}</span>
                    <span className="text-sm font-semibold text-charcoal-800">{stat.value}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-charcoal-800">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setCurrentPage(action.page)}
                className="group flex flex-col items-start gap-3 p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-gold-300 hover:bg-white transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-cream-200 flex items-center justify-center group-hover:bg-gold-100 group-hover:border-gold-300 transition-all">
                  <Icon size={18} className="text-charcoal-600 group-hover:text-gold-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal-700">{action.label}</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Activities */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-charcoal-800">Upcoming Activities</h3>
            <p className="text-xs text-charcoal-400 mt-0.5">Your scheduled items and deadlines</p>
          </div>
          <button
            onClick={() => setCurrentPage('upcoming')}
            className="btn-ghost text-xs"
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {upcomingActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={32} className="text-charcoal-300 mb-2" />
              <p className="text-sm text-charcoal-400">No upcoming activities. You are all caught up!</p>
            </div>
          ) : (
            upcomingActivities.map((activity) => {
              const categoryIcons = {
                email: Mail,
                meeting: Mic,
                task: CheckSquare,
                deadline: AlertCircle,
                reminder: Clock,
              };
              const Icon = categoryIcons[activity.category];
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-charcoal-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-700 truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-charcoal-400">
                      <span>{relativeDate(activity.date)}</span>
                      <span>·</span>
                      <span>{activity.time}</span>
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
            })
          )}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Emails */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-charcoal-800 text-sm">Recent Emails</h3>
            <button onClick={() => setCurrentPage('execumail')} className="text-xs text-charcoal-400 hover:text-charcoal-600">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {generatedEmails.length === 0 ? (
              <div className="flex items-center gap-3 py-6 text-center flex-col">
                <FileText size={24} className="text-charcoal-300" />
                <p className="text-xs text-charcoal-400">No emails generated yet</p>
              </div>
            ) : (
              generatedEmails.slice(0, 3).map((email) => (
                <div key={email.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream-50">
                  <Mail size={14} className="text-charcoal-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal-700 truncate">{email.subject}</p>
                    <p className="text-[10px] text-charcoal-400">To: {email.recipient}</p>
                  </div>
                </div>
              ))
            )}
            {scheduledEmails.slice(0, 2).map((email) => (
              <div key={email.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream-50">
                <Clock size={14} className="text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-charcoal-700 truncate">{email.subject}</p>
                  <p className="text-[10px] text-charcoal-400">Scheduled: {relativeDate(email.date)} at {email.time}</p>
                </div>
                <StatusBadge status={email.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-charcoal-800 text-sm">Recent Meetings</h3>
            <button onClick={() => setCurrentPage('execurizer')} className="text-xs text-charcoal-400 hover:text-charcoal-600">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {meetings.length === 0 ? (
              <div className="flex items-center gap-3 py-6 text-center flex-col">
                <Mic size={24} className="text-charcoal-300" />
                <p className="text-xs text-charcoal-400">No meetings processed yet</p>
              </div>
            ) : (
              meetings.slice(0, 3).map((meeting) => (
                <div key={meeting.id} className="p-3 rounded-lg hover:bg-cream-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-charcoal-700 truncate">{meeting.title}</p>
                    <span className="text-[10px] text-charcoal-400 flex-shrink-0 ml-2">{meeting.duration}</span>
                  </div>
                  <p className="text-[10px] text-charcoal-400 line-clamp-1">{meeting.summary}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-charcoal-400">{meeting.actionItems.length} action items</span>
                    <span className="text-[10px] text-charcoal-400">·</span>
                    <span className="text-[10px] text-charcoal-400">{meeting.participants.length} participants</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
