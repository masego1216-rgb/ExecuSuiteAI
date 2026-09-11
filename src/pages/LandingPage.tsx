import { useState } from 'react';
import {
  Sparkles,
  Mail,
  Mic,
  CheckSquare,
  ArrowRight,
  Zap,
  Calendar,
  FileText,
  Shield,
  Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { User } from '@/types';

export function LandingPage() {
  const { login } = useApp();
  const [view, setView] = useState<'hero' | 'login'>('hero');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleDemoLogin = () => {
    login({
      name: 'Alex Morgan',
      email: 'alex.morgan@execusuite.ai',
      role: 'Senior Product Manager',
      avatar: '',
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = isSignUp ? (name || email.split('@')[0]) : (email.split('@')[0] || 'Alex Morgan');
    login({
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email || 'alex.morgan@execusuite.ai',
      role: 'Professional',
      avatar: '',
    });
  };

  const features = [
    { icon: Mail, title: 'ExecuMail', desc: 'Write professional emails in seconds with AI-powered generation and smart scheduling.' },
    { icon: Mic, title: 'ExecuRizer', desc: 'Transcribe meetings in real-time and get instant summaries with actionable items.' },
    { icon: CheckSquare, title: 'ExecuPlanner', desc: 'Plan your day intelligently with AI-suggested tasks and smart prioritization.' },
  ];

  const stats = [
    { icon: Zap, label: '3 AI Tools', sub: 'In one platform' },
    { icon: Clock, label: 'Save Hours', sub: 'Every week' },
    { icon: Shield, label: 'Secure', sub: 'Enterprise-ready' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Nav bar */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-charcoal-700 to-charcoal-900 flex items-center justify-center">
            <Sparkles size={20} className="text-gold-400" />
          </div>
          <div>
            <h1 className="font-semibold text-charcoal-800">ExecuSuite AI</h1>
            <p className="text-[10px] text-charcoal-400">Productivity Platform</p>
          </div>
        </div>
        <button
          onClick={() => setView('login')}
          className="btn-secondary"
        >
          Sign In
        </button>
      </nav>

      {view === 'hero' ? (
        <>
          {/* Hero */}
          <section className="px-6 lg:px-12 pt-12 lg:pt-20 pb-16 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-cream-300 rounded-full text-xs font-medium text-charcoal-500 mb-6 shadow-card">
                <Sparkles size={14} className="text-gold-500" />
                AI-Powered Workplace Productivity
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-medium text-charcoal-800 text-balance leading-tight">
                Your intelligent workplace
                <br />
                <span className="text-gold-600">productivity assistant.</span>
              </h1>
              <p className="mt-6 text-lg text-charcoal-500 max-w-2xl mx-auto text-balance leading-relaxed">
                Write smarter emails, turn meetings into actionable insights, and organize
                your workday with AI — all in one unified platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setView('login')}
                  className="btn-primary px-6 py-3 text-base w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={handleDemoLogin}
                  className="btn-gold px-6 py-3 text-base w-full sm:w-auto"
                >
                  Continue with Demo Account
                </button>
              </div>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors"
              >
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-8 mt-16 max-w-3xl mx-auto">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="card p-4 lg:p-6 text-center">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-cream-100 flex items-center justify-center mx-auto mb-3">
                      <Icon size={20} className="text-gold-600" />
                    </div>
                    <p className="text-lg lg:text-2xl font-semibold text-charcoal-800">{stat.label}</p>
                    <p className="text-xs text-charcoal-400">{stat.sub}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Features */}
          <section id="features" className="px-6 lg:px-12 py-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-serif font-medium text-charcoal-800">
                Three powerful tools. One platform.
              </h2>
              <p className="mt-3 text-charcoal-500">Everything you need to stay productive, powered by AI.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="card card-hover p-6 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon size={24} className="text-charcoal-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-charcoal-500 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="px-6 lg:px-12 py-16 max-w-4xl mx-auto">
            <div className="card p-8 lg:p-12 text-center bg-gradient-to-br from-charcoal-800 to-charcoal-900 border-0">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-gold-400" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif font-medium text-cream-50">
                Ready to boost your productivity?
              </h2>
              <p className="mt-3 text-cream-200 max-w-xl mx-auto">
                Join professionals using ExecuSuite AI to work smarter, not harder.
              </p>
              <button
                onClick={handleDemoLogin}
                className="mt-6 btn-gold px-6 py-3 text-base"
              >
                Try Demo Now — It is Free
                <ArrowRight size={18} />
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-cream-200 px-6 lg:px-12 py-8 text-center">
            <p className="text-xs text-charcoal-400">
              ExecuSuite AI — Intelligent Workplace Productivity Platform
            </p>
          </footer>
        </>
      ) : (
        /* Login view */
        <section className="px-6 py-12 max-w-md mx-auto">
          <div className="card p-8 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-charcoal-700 to-charcoal-900 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-gold-400" />
              </div>
              <h2 className="text-xl font-semibold text-charcoal-800">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-charcoal-400 mt-1">
                {isSignUp ? 'Start your productivity journey' : 'Sign in to your workspace'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="input-field"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-500 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-charcoal-400">or</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="btn-gold w-full py-3"
            >
              <Sparkles size={16} />
              Continue with Demo Account
            </button>

            <p className="text-center text-xs text-charcoal-400 mt-5">
              {isSignUp ? 'Already have an account?' : 'New to ExecuSuite AI?'}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gold-600 font-medium hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            </p>
            <p className="text-center text-[10px] text-charcoal-300 mt-3">
              Demo authentication — no real credentials needed
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
