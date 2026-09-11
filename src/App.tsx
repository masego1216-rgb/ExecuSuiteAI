import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/ui/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExecuMailPage } from '@/pages/ExecuMailPage';
import { ExecuRizerPage } from '@/pages/ExecuRizerPage';
import { ExecuPlannerPage } from '@/pages/ExecuPlannerPage';
import { UpcomingPage } from '@/pages/UpcomingPage';
import { CompletedPage } from '@/pages/CompletedPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { HelpPage } from '@/pages/HelpPage';

function AppContent() {
  const { user, currentPage } = useApp();

  if (!user) {
    return <LandingPage />;
  }

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    execumail: <ExecuMailPage />,
    execurizer: <ExecuRizerPage />,
    execuplanner: <ExecuPlannerPage />,
    upcoming: <UpcomingPage />,
    completed: <CompletedPage />,
    settings: <SettingsPage />,
    help: <HelpPage />,
  };

  return (
    <div className="flex h-screen bg-cream-50 overflow-hidden">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {pages[currentPage] || <DashboardPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}
