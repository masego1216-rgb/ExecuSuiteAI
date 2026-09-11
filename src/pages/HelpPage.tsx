import {
  LifeBuoy,
  Mail,
  Mic,
  CheckSquare,
  CalendarClock,
  Sparkles,
  BookOpen,
  Video,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function HelpPage() {
  const { setCurrentPage, showToast } = useApp();

  const faqs = [
    {
      q: 'How does ExecuMail generate emails?',
      a: 'ExecuMail uses AI to analyze your recipient, subject, purpose, tone, and length preferences to craft a professional email. Simply describe what you want to say, and AI will generate a complete email with greeting, body, and closing.',
    },
    {
      q: 'Can I record any meeting with ExecuRizer?',
      a: 'Yes. You can record live meetings using your microphone or upload audio files (MP3, WAV, M4A, WebM). The AI will transcribe and summarize the content, extracting key points and action items automatically.',
    },
    {
      q: 'How does the AI task planner work?',
      a: 'Tell ExecuPlanner your main goal for the day, select your focus areas, and specify your available hours. The AI will create an optimized schedule with prioritized tasks, time blocks, and smart suggestions.',
    },
    {
      q: 'Is my data secure?',
      a: 'ExecuSuite AI is designed with privacy in mind. Your recordings and data are processed securely. In this demo version, data is stored locally in your browser session.',
    },
    {
      q: 'Can I schedule emails to send later?',
      a: 'Yes. After generating an email, click Schedule to choose a date, time, timezone, and reminder. The scheduled email appears in your Scheduled Emails list and the Upcoming section.',
    },
    {
      q: 'Does ExecuRizer support languages other than English?',
      a: 'Currently, speech recognition and transcription support English. Additional language support is planned for future releases.',
    },
  ];

  const guides = [
    { icon: Mail, title: 'Getting Started with ExecuMail', desc: 'Learn to generate professional emails in seconds', page: 'execumail' as const },
    { icon: Mic, title: 'Recording Your First Meeting', desc: 'Transcribe and summarize meetings with AI', page: 'execurizer' as const },
    { icon: CheckSquare, title: 'Planning Your Day with AI', desc: 'Let AI create your optimal daily schedule', page: 'execuplanner' as const },
    { icon: CalendarClock, title: 'Managing Upcoming Activities', desc: 'Track scheduled emails, meetings, and deadlines', page: 'upcoming' as const },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in max-w-4xl">
      {/* Hero */}
      <div className="card p-6 lg:p-8 bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-0 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
          <LifeBuoy size={28} className="text-gold-400" />
        </div>
        <h2 className="text-xl lg:text-2xl font-serif font-medium text-cream-50">How can we help you?</h2>
        <p className="mt-2 text-sm text-cream-200 max-w-lg mx-auto">
          Find guides, answers to common questions, and ways to get the most out of ExecuSuite AI.
        </p>
      </div>

      {/* Quick Guides */}
      <div>
        <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-charcoal-400" />
          Quick Guides
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.title}
                onClick={() => setCurrentPage(guide.page)}
                className="card card-hover p-4 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-100 transition-colors">
                    <Icon size={18} className="text-charcoal-600 group-hover:text-gold-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal-700">{guide.title}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">{guide.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
          <MessageCircle size={18} className="text-charcoal-400" />
          Frequently Asked Questions
        </h3>
        <div className="card divide-y divide-cream-200">
          {faqs.map((faq, i) => (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer text-sm font-medium text-charcoal-700 flex items-center justify-between list-none">
                {faq.q}
                <span className="text-charcoal-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 text-sm text-charcoal-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid sm:grid-cols-3 gap-3">
        <button
          onClick={() => showToast('info', 'Live chat is not available in demo mode.')}
          className="card card-hover p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-2">
            <MessageCircle size={18} className="text-charcoal-600" />
          </div>
          <p className="text-sm font-medium text-charcoal-700">Live Chat</p>
          <p className="text-xs text-charcoal-400">Chat with our team</p>
        </button>
        <button
          onClick={() => showToast('info', 'Video tutorials coming soon!')}
          className="card card-hover p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-2">
            <Video size={18} className="text-charcoal-600" />
          </div>
          <p className="text-sm font-medium text-charcoal-700">Video Tutorials</p>
          <p className="text-xs text-charcoal-400">Watch and learn</p>
        </button>
        <button
          onClick={() => showToast('info', 'Email support: support@execusuite.ai (demo)')}
          className="card card-hover p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-2">
            <Mail size={18} className="text-charcoal-600" />
          </div>
          <p className="text-sm font-medium text-charcoal-700">Email Support</p>
          <p className="text-xs text-charcoal-400">Get help by email</p>
        </button>
      </div>

      {/* About */}
      <div className="card p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} className="text-gold-500" />
          <p className="text-sm font-semibold text-charcoal-800">ExecuSuite AI</p>
        </div>
        <p className="text-xs text-charcoal-400">
          Version 1.0.0 — Intelligent Workplace Productivity Platform
        </p>
        <p className="text-xs text-charcoal-300 mt-2">
          This is a demo prototype. AI features use local processing and simulated responses.
        </p>
      </div>
    </div>
  );
}
