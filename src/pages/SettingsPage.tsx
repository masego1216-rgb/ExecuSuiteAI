import { useState } from 'react';
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Mail,
  Mic,
  CheckSquare,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function SettingsPage() {
  const { user, showToast } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    meetingSummaries: true,
    taskDeadlines: true,
    weeklyReport: false,
  });

  const [preferences, setPreferences] = useState({
    defaultEmailTone: 'professional',
    defaultEmailLength: 'medium',
    autoSummarize: true,
    autoPlan: false,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'English',
    timezone: 'PST',
  });

  const handleSaveProfile = () => {
    showToast('success', 'Profile updated successfully.');
  };

  const handleSaveNotifications = () => {
    showToast('success', 'Notification preferences saved.');
  };

  const handleSavePreferences = () => {
    showToast('success', 'AI preferences saved.');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-gold-500' : 'bg-cream-300'}`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
          checked ? 'left-5' : 'left-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in max-w-3xl">
      {/* Profile */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
            <User size={20} className="text-charcoal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">Profile</h3>
            <p className="text-xs text-charcoal-400">Manage your personal information</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Role / Title</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleSaveProfile} className="btn-primary">
            <Check size={16} /> Save Profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
            <Bell size={20} className="text-charcoal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">Notifications</h3>
            <p className="text-xs text-charcoal-400">Choose what you want to be notified about</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { key: 'emailReminders' as const, label: 'Email Reminders', desc: 'Get notified before scheduled emails are sent', icon: Mail },
            { key: 'meetingSummaries' as const, label: 'Meeting Summaries', desc: 'Notify when meeting summaries are ready', icon: Mic },
            { key: 'taskDeadlines' as const, label: 'Task Deadlines', desc: 'Alerts for upcoming task deadlines', icon: CheckSquare },
            { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly productivity summary', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
                <Icon size={18} className="text-charcoal-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal-700">{item.label}</p>
                  <p className="text-xs text-charcoal-400">{item.desc}</p>
                </div>
                <Toggle checked={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
              </div>
            );
          })}
        </div>
        <button onClick={handleSaveNotifications} className="btn-primary mt-4">
          <Check size={16} /> Save Notifications
        </button>
      </div>

      {/* AI Preferences */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
            <Palette size={20} className="text-gold-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">AI Preferences</h3>
            <p className="text-xs text-charcoal-400">Customize how AI assists you</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Default Email Tone</label>
              <select
                value={preferences.defaultEmailTone}
                onChange={(e) => setPreferences((prev) => ({ ...prev, defaultEmailTone: e.target.value }))}
                className="input-field cursor-pointer"
              >
                <option value="formal">Formal</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="concise">Concise</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Default Email Length</label>
              <select
                value={preferences.defaultEmailLength}
                onChange={(e) => setPreferences((prev) => ({ ...prev, defaultEmailLength: e.target.value }))}
                className="input-field cursor-pointer"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
              <Mic size={18} className="text-charcoal-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal-700">Auto-summarize meetings</p>
                <p className="text-xs text-charcoal-400">Generate summaries automatically after recording</p>
              </div>
              <Toggle checked={preferences.autoSummarize} onChange={() => togglePreference('autoSummarize')} />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
              <CheckSquare size={18} className="text-charcoal-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal-700">Auto-plan tasks from meetings</p>
                <p className="text-xs text-charcoal-400">Create tasks from meeting action items automatically</p>
              </div>
              <Toggle checked={preferences.autoPlan} onChange={() => togglePreference('autoPlan')} />
            </div>
          </div>
          <button onClick={handleSavePreferences} className="btn-primary">
            <Check size={16} /> Save Preferences
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
            <Globe size={20} className="text-charcoal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">Appearance & Locale</h3>
            <p className="text-xs text-charcoal-400">Customize your experience</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Theme</label>
            <select
              value={appearance.theme}
              onChange={(e) => setAppearance((prev) => ({ ...prev, theme: e.target.value }))}
              className="input-field cursor-pointer"
            >
              <option value="light">Light</option>
              <option value="dark" disabled>Dark (Coming soon)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Language</label>
            <select
              value={appearance.language}
              onChange={(e) => setAppearance((prev) => ({ ...prev, language: e.target.value }))}
              className="input-field cursor-pointer"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Timezone</label>
            <select
              value={appearance.timezone}
              onChange={(e) => setAppearance((prev) => ({ ...prev, timezone: e.target.value }))}
              className="input-field cursor-pointer"
            >
              <option>PST</option>
              <option>EST</option>
              <option>CST</option>
              <option>MST</option>
              <option>GMT</option>
              <option>CET</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
            <Shield size={20} className="text-charcoal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal-800">Security</h3>
            <p className="text-xs text-charcoal-400">Manage your account security</p>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => showToast('info', 'Password change is not available in demo mode.')} className="btn-secondary w-full justify-start">
            Change Password
          </button>
          <button onClick={() => showToast('info', 'Two-factor authentication is not available in demo mode.')} className="btn-secondary w-full justify-start">
            Enable Two-Factor Authentication
          </button>
          <button onClick={() => showToast('warning', 'This is a demo account. No real data to delete.')} className="btn-secondary w-full justify-start text-red-600 hover:bg-red-50 hover:border-red-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
