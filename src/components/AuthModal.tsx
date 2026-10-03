import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../oop/DatabaseService';
import { UniversityLogo } from './UniversityLogo';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  initialMode?: 'student_login' | 'student_register' | 'admin_login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'student_login',
}) => {
  const [mode, setMode] = useState<'student_login' | 'student_register' | 'admin_login'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [universityID, setUniversityID] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset to the requested mode (and clear stale errors) every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const db = DatabaseService.getInstance();

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!email.trim() || !password) {
        throw new Error('Please enter both email and password.');
      }
      const user = await db.login(email, password);
      if (user.role === 'ADMIN') {
        // If an admin logs in here, that's fine or they can use the Admin Portal tab
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!email.trim() || !password) {
        throw new Error('Please enter administrator credentials.');
      }
      const user = await db.login(email, password);
      if (user.role !== 'ADMIN') {
        db.logout();
        throw new Error('Access Denied: This account does not possess administrator clearance.');
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!name.trim()) throw new Error('Please enter your full name.');
      if (!email.trim()) throw new Error('Please enter your university email.');
      if (!universityID.trim()) throw new Error('Please enter your official university ID.');
      if (!phone.trim()) throw new Error('Please provide your contact phone number.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');

      await db.registerStudent({
        name,
        email,
        rawPassword: password,
        phone,
        universityID,
      });

      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#16325C] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <UniversityLogo size="sm" showText={false} />
            <div>
              <h2 className="font-brand-title text-xl font-bold tracking-tight text-white">
                iTECH Lost &amp; Found
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                {mode === 'admin_login'
                  ? 'Administrative Security Access'
                  : 'Student University Authentication'}
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 text-xs font-semibold">
            <button
              onClick={() => { setMode('student_login'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'student_login'
                  ? 'bg-white text-[#16325C] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => { setMode('student_register'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'student_register'
                  ? 'bg-white text-[#16325C] shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { setMode('admin_login'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'admin_login'
                  ? 'bg-[#A82024] text-white shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#A82024] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Student Login Form */}
          {mode === 'student_login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@itech.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                {isLoading ? 'Authenticating...' : 'Sign In as Student'}
              </button>
            </form>
          )}

          {/* 2. Student Register Form */}
          {mode === 'student_register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    University ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="IT-2024-XXXX"
                    value={universityID}
                    onChange={(e) => setUniversityID(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-8 pr-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@itech.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-lg transition-colors shadow-xs mt-2"
              >
                {isLoading ? 'Registering Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {/* 3. Admin Login Form */}
          {mode === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs text-[#A82024] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Restricted to iTECH Campus Security &amp; Administrative Personnel.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrative Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@itech.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A82024]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A82024]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                {isLoading ? 'Verifying Credentials...' : 'Authenticate as Administrator'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
