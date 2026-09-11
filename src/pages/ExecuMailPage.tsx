import { useState } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  RefreshCw,
  Edit3,
  Save,
  CalendarClock,
  X,
  Check,
  Clock,
  Trash2,
  Send,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { generateEmail, regenerateEmail } from '@/utils/emailGenerator';
import { uid, todayISO } from '@/utils/helpers';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badges';
import { AIGenerating, EmptyState } from '@/components/ui/Loading';
import type { EmailTone, EmailLength, GeneratedEmail, ScheduledEmail } from '@/types';

const tones: { value: EmailTone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'concise', label: 'Concise' },
  { value: 'apologetic', label: 'Apologetic' },
];

const lengths: { value: EmailLength; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'detailed', label: 'Detailed' },
];

const reminders = ['5 minutes', '15 minutes', '30 minutes', '1 hour', '1 day'];

const timezones = ['PST', 'EST', 'CST', 'MST', 'GMT', 'CET', 'IST', 'JST'];

export function ExecuMailPage() {
  const { generatedEmails, addGeneratedEmail, scheduledEmails, addScheduledEmail, cancelScheduledEmail, showToast } = useApp();

  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState<EmailTone>('professional');
  const [length, setLength] = useState<EmailLength>('medium');
  const [language, setLanguage] = useState('English');

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ subject: string; body: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [copied, setCopied] = useState(false);

  // Schedule modal
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedRecipient, setSchedRecipient] = useState('');
  const [schedSubject, setSchedSubject] = useState('');
  const [schedDate, setSchedDate] = useState(todayISO());
  const [schedTime, setSchedTime] = useState('09:00');
  const [schedTimezone, setSchedTimezone] = useState('PST');
  const [schedReminder, setSchedReminder] = useState('15 minutes');

  const handleGenerate = () => {
    if (!purpose.trim()) {
      showToast('warning', 'Please describe the purpose of your email first.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const result = generateEmail({
        recipient: recipient || 'there',
        subject,
        purpose,
        tone,
        length,
      });
      setGenerated(result);
      setGenerating(false);
      showToast('success', 'Email generated successfully!');

      const email: GeneratedEmail = {
        id: uid('email'),
        recipient: recipient || 'recipient',
        subject: result.subject,
        body: result.body,
        tone,
        length,
        purpose,
        createdAt: new Date().toISOString(),
      };
      addGeneratedEmail(email);
    }, 1500);
  };

  const handleRegenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const result = regenerateEmail({
        recipient: recipient || 'there',
        subject,
        purpose,
        tone,
        length,
      });
      setGenerated(result);
      setGenerating(false);
      showToast('info', 'Email regenerated with a new variation.');
    }, 1200);
  };

  const handleCopy = () => {
    if (!generated) return;
    const text = `Subject: ${generated.subject}\n\n${generated.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('success', 'Email copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    if (!generated) return;
    showToast('success', 'Email saved as draft.');
  };

  const handleEdit = () => {
    if (!generated) return;
    setEditSubject(generated.subject);
    setEditBody(generated.body);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    setGenerated({ subject: editSubject, body: editBody });
    setEditing(false);
    showToast('success', 'Email updated.');
  };

  const openSchedule = () => {
    if (!generated) return;
    setSchedRecipient(recipient || '');
    setSchedSubject(generated.subject);
    setShowSchedule(true);
  };

  const handleSchedule = () => {
    if (!generated || !schedRecipient.trim()) {
      showToast('warning', 'Please enter a recipient email.');
      return;
    }
    const scheduled: ScheduledEmail = {
      id: uid('sched'),
      recipient: schedRecipient,
      subject: schedSubject,
      body: generated.body,
      date: schedDate,
      time: schedTime,
      timezone: schedTimezone,
      reminder: schedReminder,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    addScheduledEmail(scheduled);
    setShowSchedule(false);
    showToast('success', `Email scheduled for ${schedDate} at ${schedTime} ${schedTimezone}.`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
              <Mail size={20} className="text-charcoal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-800">Email Details</h3>
              <p className="text-xs text-charcoal-400">Fill in the details and let AI write your email</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="name@company.com or John Smith"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Leave blank for AI to generate"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">
                Purpose / Instructions
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Write an email to my manager requesting a meeting to discuss project priorities..."
                className="input-field min-h-[120px] resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as EmailTone)}
                  className="input-field cursor-pointer"
                >
                  {tones.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as EmailLength)}
                  className="input-field cursor-pointer"
                >
                  {lengths.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Portuguese</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full py-3"
            >
              <Sparkles size={18} />
              {generating ? 'Generating...' : 'Generate Email'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="card p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
              <Sparkles size={20} className="text-gold-600" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-800">AI Generated Email</h3>
              <p className="text-xs text-charcoal-400">Review, edit, and send</p>
            </div>
          </div>

          {generating ? (
            <AIGenerating label="AI is writing your email..." />
          ) : !generated ? (
            <EmptyState
              icon={Mail}
              title="No email generated yet"
              description="Fill in the details on the left and click Generate Email to see AI-written content here."
            />
          ) : editing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Body</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="input-field min-h-[300px] resize-y font-mono text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="btn-primary flex-1">
                  <Check size={16} /> Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200">
                <p className="text-xs text-charcoal-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-charcoal-800">{generated.subject}</p>
              </div>
              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200">
                <p className="text-xs text-charcoal-400 mb-2">Email Body</p>
                <pre className="text-sm text-charcoal-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {generated.body}
                </pre>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleCopy} className="btn-secondary">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleRegenerate} className="btn-secondary">
                  <RefreshCw size={16} /> Regenerate
                </button>
                <button onClick={handleEdit} className="btn-secondary">
                  <Edit3 size={16} /> Edit
                </button>
                <button onClick={handleSaveDraft} className="btn-secondary">
                  <Save size={16} /> Save Draft
                </button>
                <button onClick={openSchedule} className="btn-gold">
                  <CalendarClock size={16} /> Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Emails */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <CalendarClock size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-800">Scheduled Emails</h3>
              <p className="text-xs text-charcoal-400">Manage your scheduled and sent emails</p>
            </div>
          </div>
          <span className="badge bg-cream-100 text-charcoal-500">
            {scheduledEmails.filter((e) => e.status === 'scheduled').length} scheduled
          </span>
        </div>

        {scheduledEmails.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No scheduled emails"
            description="Generate an email and schedule it to see it here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-charcoal-400 border-b border-cream-200">
                  <th className="pb-2 font-medium">Recipient</th>
                  <th className="pb-2 font-medium">Subject</th>
                  <th className="pb-2 font-medium hidden md:table-cell">Date</th>
                  <th className="pb-2 font-medium hidden md:table-cell">Time</th>
                  <th className="pb-2 font-medium hidden lg:table-cell">Reminder</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledEmails.map((email) => (
                  <tr key={email.id} className="border-b border-cream-100 hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 text-charcoal-700 text-xs">{email.recipient}</td>
                    <td className="py-3 text-charcoal-700 text-xs font-medium max-w-[180px] truncate">{email.subject}</td>
                    <td className="py-3 text-charcoal-500 text-xs hidden md:table-cell">{email.date}</td>
                    <td className="py-3 text-charcoal-500 text-xs hidden md:table-cell">{email.time} {email.timezone}</td>
                    <td className="py-3 text-charcoal-500 text-xs hidden lg:table-cell">{email.reminder}</td>
                    <td className="py-3"><StatusBadge status={email.status} /></td>
                    <td className="py-3 text-right">
                      {email.status === 'scheduled' && (
                        <button
                          onClick={() => {
                            cancelScheduledEmail(email.id);
                            showToast('info', 'Scheduled email cancelled.');
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          title="Cancel"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      {email.status === 'sent' && (
                        <Send size={14} className="text-green-500 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[10px] text-charcoal-300 mt-3">
          Note: Email scheduling is simulated for this demo. No real emails are sent.
        </p>
      </div>

      {/* Schedule Modal */}
      <Modal
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        title="Schedule Email"
        subtitle="Set when this email should be sent"
        footer={
          <>
            <button onClick={() => setShowSchedule(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSchedule} className="btn-primary">
              <CalendarClock size={16} /> Schedule Email
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Recipient Email</label>
            <input
              type="email"
              value={schedRecipient}
              onChange={(e) => setSchedRecipient(e.target.value)}
              placeholder="recipient@company.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Subject</label>
            <input
              type="text"
              value={schedSubject}
              onChange={(e) => setSchedSubject(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Date</label>
              <input
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Time</label>
              <input
                type="time"
                value={schedTime}
                onChange={(e) => setSchedTime(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Time Zone</label>
              <select
                value={schedTimezone}
                onChange={(e) => setSchedTimezone(e.target.value)}
                className="input-field cursor-pointer"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Reminder Before Sending</label>
              <select
                value={schedReminder}
                onChange={(e) => setSchedReminder(e.target.value)}
                className="input-field cursor-pointer"
              >
                {reminders.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-3 bg-gold-50 rounded-lg flex items-start gap-2">
            <Clock size={16} className="text-gold-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gold-800">
              You will receive a reminder {schedReminder} before the email is sent. (Simulated for demo)
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
