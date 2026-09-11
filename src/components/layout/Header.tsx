import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getGreeting } from '@/utils/helpers';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your productivity overview' },
  execumail: { title: 'ExecuMail', subtitle: 'AI Smart Email Generator' },
  execurizer: { title: 'ExecuRizer', subtitle: 'AI Meeting Transcription & Summarizer' },
  execuplanner: { title: 'ExecuPlanner', subtitle: 'AI Task Planner & Scheduler' },
  upcoming: { title: 'Upcoming', subtitle: 'Scheduled activities and deadlines' },
  completed: { title: 'Completed', subtitle: 'Your finished work' },
  settings: { title: 'Settings', subtitle: 'Manage your preferences' },
  help: { title: 'Help & Support', subtitle: 'Get assistance and learn more' },
};

export function Header() {
  const { currentPage, setMobileNavOpen, user, activities } = useApp();
  const info = pageTitles[currentPage] || pageTitles.dashboard;
  const greeting = getGreeting();

  const pendingCount = activities.filter(
    (a) => a.status === 'pending' || a.status === 'due-soon'
  ).length;

  return (
    <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-md border-b border-cream-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 rounded-lg text-charcoal-500 hover:bg-cream-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-base lg:text-lg font-semibold text-charcoal-800 truncate">
              {currentPage === 'dashboard' ? `${greeting}, ${user?.name?.split(' ')[0] || ''}` : info.title}
            </h2>
            <p className="text-xs lg:text-sm text-charcoal-400 truncate">
              {currentPage === 'dashboard' ? 'Here is your productivity overview for today.' : info.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-cream-200 rounded-xl text-sm text-charcoal-400 w-56 lg:w-64">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 placeholder-charcoal-300 text-charcoal-600"
            />
          </div>
          <button className="relative p-2 rounded-xl text-charcoal-500 hover:bg-cream-100 transition-colors">
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 rounded-full text-[10px] flex items-center justify-center text-charcoal-900 font-semibold">
                {pendingCount}
              </span>
            )}
          </button>
          <div className="w-9 h-9 rounded-full bg-gold-200 flex items-center justify-center text-sm font-semibold text-gold-800">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
