import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  User,
  GeneratedEmail,
  ScheduledEmail,
  MeetingSummary,
  Task,
  UpcomingActivity,
  Toast,
  PageId,
} from '@/types';
import { uid, todayISO } from '@/utils/helpers';

interface AppContextValue {
  // Auth
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Navigation
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;

  // Emails
  generatedEmails: GeneratedEmail[];
  addGeneratedEmail: (email: GeneratedEmail) => void;
  scheduledEmails: ScheduledEmail[];
  addScheduledEmail: (email: ScheduledEmail) => void;
  cancelScheduledEmail: (id: string) => void;

  // Meetings
  meetings: MeetingSummary[];
  addMeeting: (meeting: MeetingSummary) => void;
  toggleActionItem: (meetingId: string, actionId: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Activities
  activities: UpcomingActivity[];
  addActivity: (activity: UpcomingActivity) => void;
  removeActivity: (id: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string) => void;
  dismissToast: (id: string) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Seed data for a rich demo experience
function getSeedData() {
  const today = todayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const seedTasks: Task[] = [
    {
      id: uid('task'),
      title: 'Finalize Q3 budget proposal',
      description: 'Complete the financial breakdown and submit to CFO for review.',
      priority: 'high',
      status: 'in-progress',
      dueDate: today,
      dueTime: '14:00',
      category: 'Project',
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('task'),
      title: 'Review team performance metrics',
      description: 'Analyze monthly KPIs and prepare summary for leadership meeting.',
      priority: 'medium',
      status: 'todo',
      dueDate: today,
      dueTime: '16:00',
      category: 'Review',
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('task'),
      title: 'Send project update to stakeholders',
      description: '',
      priority: 'medium',
      status: 'completed',
      dueDate: today,
      dueTime: '10:00',
      category: 'Communication',
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('task'),
      title: 'Prepare presentation for client meeting',
      description: 'Create slides for Thursday client demo.',
      priority: 'urgent',
      status: 'todo',
      dueDate: tomorrowStr,
      dueTime: '09:00',
      category: 'Project',
      aiSuggested: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const seedScheduledEmails: ScheduledEmail[] = [
    {
      id: uid('email'),
      recipient: 'sarah.chen@company.com',
      subject: 'Project Timeline Update — Q3 Roadmap',
      body: '',
      date: tomorrowStr,
      time: '09:00',
      timezone: 'PST',
      reminder: '15 minutes',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('email'),
      recipient: 'marketing@company.com',
      subject: 'Campaign Review Notes',
      body: '',
      date: nextWeekStr,
      time: '14:00',
      timezone: 'PST',
      reminder: '1 hour',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    },
  ];

  const seedMeetings: MeetingSummary[] = [
    {
      id: uid('meeting'),
      title: 'Weekly Product Sync',
      date: new Date().toISOString(),
      duration: '32:15',
      transcript: [
        { id: uid('seg'), text: 'Let is start with the product roadmap update for this sprint.', timestamp: '00:00', speaker: 'Sarah' },
        { id: uid('seg'), text: 'The new dashboard feature is on track for delivery by Friday.', timestamp: '02:15', speaker: 'Mike' },
        { id: uid('seg'), text: 'John will complete the financial report by Friday and we should review it Monday.', timestamp: '08:30', speaker: 'Sarah' },
        { id: uid('seg'), text: 'We need to schedule a client demo for next Wednesday.', timestamp: '15:00', speaker: 'Emily' },
        { id: uid('seg'), text: 'I will send out the meeting notes and action items after this call.', timestamp: '28:45', speaker: 'Mike' },
      ],
      summary: 'This 32-minute product sync covered the current sprint roadmap, with a focus on the new dashboard feature delivery. The team identified 2 action items, with team members assigned to follow up. The meeting concluded with clear next steps including a client demo next Wednesday.',
      keyPoints: [
        'New dashboard feature on track for Friday delivery',
        'Client demo scheduled for next Wednesday',
        'Financial report review planned for Monday',
      ],
      actionItems: [
        { id: uid('action'), text: 'Complete the financial report', assignee: 'John', deadline: 'Friday', done: false },
        { id: uid('action'), text: 'Schedule client demo for Wednesday', assignee: 'Emily', deadline: 'Next Wednesday', done: false },
        { id: uid('action'), text: 'Send out meeting notes and action items', assignee: 'Mike', deadline: 'Today', done: true },
      ],
      participants: ['Sarah', 'Mike', 'Emily', 'John'],
      createdAt: new Date().toISOString(),
    },
  ];

  const seedActivities: UpcomingActivity[] = [
    {
      id: uid('act'),
      title: 'Project Timeline Update — Q3 Roadmap',
      date: tomorrowStr,
      time: '09:00',
      category: 'email',
      status: 'scheduled',
      detail: 'To: sarah.chen@company.com',
    },
    {
      id: uid('act'),
      title: 'Client Strategy Meeting',
      date: tomorrowStr,
      time: '11:00',
      category: 'meeting',
      status: 'pending',
      detail: 'Conference Room B',
    },
    {
      id: uid('act'),
      title: 'Prepare presentation for client meeting',
      date: tomorrowStr,
      time: '09:00',
      category: 'task',
      status: 'due-soon',
      detail: 'High priority',
    },
    {
      id: uid('act'),
      title: 'Campaign Review Notes',
      date: nextWeekStr,
      time: '14:00',
      category: 'email',
      status: 'scheduled',
      detail: 'To: marketing@company.com',
    },
    {
      id: uid('act'),
      title: 'Finalize Q3 budget proposal',
      date: today,
      time: '14:00',
      category: 'deadline',
      status: 'due-soon',
      detail: 'High priority',
    },
    {
      id: uid('act'),
      title: 'Weekly team standup',
      date: today,
      time: '09:30',
      category: 'reminder',
      status: 'completed',
      detail: 'Daily reminder',
    },
  ];

  return { seedTasks, seedScheduledEmails, seedMeetings, seedActivities };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const seed = getSeedData();

  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>(seed.seedScheduledEmails);
  const [meetings, setMeetings] = useState<MeetingSummary[]>(seed.seedMeetings);
  const [tasks, setTasks] = useState<Task[]>(seed.seedTasks);
  const [activities, setActivities] = useState<UpcomingActivity[]>(seed.seedActivities);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const login = useCallback((u: User) => setUser(u), []);
  const logout = useCallback(() => {
    setUser(null);
    setCurrentPage('dashboard');
  }, []);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addGeneratedEmail = useCallback((email: GeneratedEmail) => {
    setGeneratedEmails((prev) => [email, ...prev].slice(0, 20));
  }, []);

  const addScheduledEmail = useCallback((email: ScheduledEmail) => {
    setScheduledEmails((prev) => [email, ...prev]);
    setActivities((prev) => [
      {
        id: email.id,
        title: email.subject,
        date: email.date,
        time: email.time,
        category: 'email' as const,
        status: 'scheduled' as const,
        detail: `To: ${email.recipient}`,
      },
      ...prev,
    ]);
  }, []);

  const cancelScheduledEmail = useCallback((id: string) => {
    setScheduledEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'cancelled' as const } : e))
    );
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addMeeting = useCallback((meeting: MeetingSummary) => {
    setMeetings((prev) => [meeting, ...prev]);
  }, []);

  const toggleActionItem = useCallback((meetingId: string, actionId: string) => {
    setMeetings((prev) =>
      prev.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              actionItems: m.actionItems.map((a) =>
                a.id === actionId ? { ...a, done: !a.done } : a
              ),
            }
          : m
      )
    );
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setActivities((prev) => [
      {
        id: task.id,
        title: task.title,
        date: task.dueDate,
        time: task.dueTime,
        category: 'task' as const,
        status: task.status === 'completed' ? ('completed' as const) : ('pending' as const),
        detail: task.priority === 'high' || task.priority === 'urgent' ? 'High priority' : undefined,
      },
      ...prev,
    ]);
  }, []);

  const addTasks = useCallback((newTasks: Task[]) => {
    setTasks((prev) => [...newTasks, ...prev]);
    setActivities((prev) => [
      ...newTasks.map((t) => ({
        id: t.id,
        title: t.title,
        date: t.dueDate,
        time: t.dueTime,
        category: 'task' as const,
        status: 'pending' as const,
        detail: t.priority === 'high' || t.priority === 'urgent' ? 'High priority' : undefined,
      })),
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? ('todo' as const) : ('completed' as const) }
          : t
      )
    );
  }, []);

  const addActivity = useCallback((activity: UpcomingActivity) => {
    setActivities((prev) => [activity, ...prev]);
  }, []);

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

  const value: AppContextValue = {
    user,
    login,
    logout,
    currentPage,
    setCurrentPage: (page: PageId) => {
      setCurrentPage(page);
      setMobileNavOpen(false);
    },
    generatedEmails,
    addGeneratedEmail,
    scheduledEmails,
    addScheduledEmail,
    cancelScheduledEmail,
    meetings,
    addMeeting,
    toggleActionItem,
    tasks,
    addTask,
    addTasks,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    activities,
    addActivity,
    removeActivity,
    toasts,
    showToast,
    dismissToast,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
