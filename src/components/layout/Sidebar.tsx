import {
  LayoutDashboard,
  Mail,
  Mic,
  CheckSquare,
  CalendarClock,
  CheckCircle2,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/types';

const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'execumail', label: 'ExecuMail', icon: Mail },
  { id: 'execurizer', label: 'ExecuRizer', icon: Mic },
  { id: 'execuplanner', label: 'ExecuPlanner', icon: CheckSquare },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: LifeBuoy },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, user, logout } = useApp();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-cream-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-cream-200">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-charcoal-700 to-charcoal-900 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-gold-400" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-semibold text-sm text-charcoal-800 tracking-tight whitespace-nowrap">ExecuSuite AI</h1>
            <p className="text-[10px] text-charcoal-400 whitespace-nowrap">Productivity Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? 'bg-charcoal-800 text-cream-50'
                  : 'text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {active && !sidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-cream-200 p-2 space-y-1">
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-cream-50">
            <div className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center text-sm font-semibold text-gold-800 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-charcoal-700 truncate">{user.name}</p>
              <p className="text-[10px] text-charcoal-400 truncate">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-[10px] text-charcoal-400 hover:text-charcoal-600 transition-colors"
            >
              Exit
            </button>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen, currentPage, setCurrentPage, user, logout } = useApp();

  if (!mobileNavOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col animate-slide-in-left">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-cream-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-charcoal-700 to-charcoal-900 flex items-center justify-center">
            <Sparkles size={18} className="text-gold-400" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-charcoal-800">ExecuSuite AI</h1>
            <p className="text-[10px] text-charcoal-400">Productivity Platform</p>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-charcoal-800 text-cream-50'
                    : 'text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        {user && (
          <div className="border-t border-cream-200 p-3">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-cream-50 mb-2">
              <div className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center text-sm font-semibold text-gold-800">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-charcoal-700">{user.name}</p>
                <p className="text-[10px] text-charcoal-400">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full text-xs text-charcoal-400 hover:text-charcoal-600 py-2"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
