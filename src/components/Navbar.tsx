import React, { useState } from 'react';
import { User } from '../oop/User';
import { UniversityLogo } from './UniversityLogo';
import {
  Menu,
  X,
  Search,
  PlusCircle,
  FolderOpen,
  LayoutDashboard,
  Shield,
  LogOut,
  LogIn,
  Code2,
  FileText,
  Users,
  Database,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'student_login' | 'student_register' | 'admin_login') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top University Brand Bar */}
      <div className="bg-[#16325C] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-200 uppercase tracking-widest text-[10px]">
              Official Campus Portal
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/80 hidden sm:inline text-[11px]">
              International Institute of Technology, Culture &amp; Health Sciences
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <span className="hidden md:inline text-[11px] font-medium text-slate-200">
                  {currentUser.name} ({currentUser.role === 'ADMIN' ? 'Admin' : 'Student'})
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-[11px] text-red-200 hover:text-white font-semibold"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <button
                  onClick={() => onOpenAuth('student_login')}
                  className="text-[11px] text-white hover:text-blue-200 font-semibold"
                >
                  Student Sign In
                </button>
                <span className="text-white/40">|</span>
                <button
                  onClick={() => onOpenAuth('admin_login')}
                  className="text-[11px] text-red-300 hover:text-white font-semibold"
                >
                  Admin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Portal Title */}
          <div
            onClick={() => handleNavClick(isAdmin ? 'admin-dashboard' : 'home')}
            className="cursor-pointer"
          >
            <UniversityLogo size="md" textColor="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {!isAdmin ? (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'home'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#16325C]'
                  }`}
                >
                  Home / Everything
                </button>
                <button
                  onClick={() => handleNavClick('lost')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'lost'
                      ? 'bg-[#A82024] text-white'
                      : 'text-slate-700 hover:bg-red-50 hover:text-[#A82024]'
                  }`}
                >
                  Lost Items
                </button>
                <button
                  onClick={() => handleNavClick('found')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'found'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-[#16325C]'
                  }`}
                >
                  Found Items
                </button>

                {currentUser && (
                  <button
                    onClick={() => handleNavClick('my-posts')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      currentView === 'my-posts'
                        ? 'bg-[#16325C] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    My Posts
                  </button>
                )}

                <button
                  onClick={() => handleNavClick('create-post')}
                  className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-[#A82024] hover:bg-[#88171B] text-white text-xs font-bold rounded-lg shadow-xs transition-all duration-150"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost / Found</span>
                </button>
              </>
            ) : (
              /* Admin Specific Navigation (Rule 39) */
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'admin-dashboard'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('admin-posts')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'admin-posts'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Manage Posts
                </button>
                <button
                  onClick={() => handleNavClick('admin-reports')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'admin-reports'
                      ? 'bg-[#A82024] text-white'
                      : 'text-slate-700 hover:bg-red-50 text-[#A82024]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Reported Posts
                </button>
                <button
                  onClick={() => handleNavClick('admin-students')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'admin-students'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Manage Students
                </button>
                <button
                  onClick={() => handleNavClick('admin-backup')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    currentView === 'admin-backup'
                      ? 'bg-[#16325C] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Backup &amp; Restore
                </button>
                <button
                  onClick={() => handleNavClick('home')}
                  className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200"
                >
                  Student Portal View
                </button>
              </>
            )}

            {/* Profile / Login Button */}
            {!currentUser && (
              <button
                onClick={() => onOpenAuth('student_login')}
                className="ml-2 flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 hover:text-[#16325C] hover:border-[#16325C] text-xs font-semibold rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#16325C] hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {!isAdmin ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  currentView === 'home' ? 'bg-[#16325C] text-white' : 'text-slate-700'
                }`}
              >
                Home / Everything
              </button>
              <button
                onClick={() => handleNavClick('lost')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  currentView === 'lost' ? 'bg-[#A82024] text-white' : 'text-slate-700'
                }`}
              >
                Lost Items
              </button>
              <button
                onClick={() => handleNavClick('found')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  currentView === 'found' ? 'bg-[#16325C] text-white' : 'text-slate-700'
                }`}
              >
                Found Items
              </button>
              {currentUser && (
                <button
                  onClick={() => handleNavClick('my-posts')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
                    currentView === 'my-posts' ? 'bg-[#16325C] text-white' : 'text-slate-700'
                  }`}
                >
                  My Posts
                </button>
              )}
              <button
                onClick={() => handleNavClick('create-post')}
                className="w-full mt-2 py-2.5 px-4 bg-[#A82024] text-white text-xs font-bold rounded-lg text-center"
              >
                + Report Lost or Found Item
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('admin-posts')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700"
              >
                Manage Posts
              </button>
              <button
                onClick={() => handleNavClick('admin-reports')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#A82024]"
              >
                Reported Posts
              </button>
              <button
                onClick={() => handleNavClick('admin-students')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700"
              >
                Manage Students
              </button>
              <button
                onClick={() => handleNavClick('admin-backup')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700"
              >
                Backup &amp; Restore
              </button>
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-800"
              >
                Switch to Student Portal
              </button>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => { onOpenAuth('student_login'); setMobileMenuOpen(false); }}
                  className="py-2 px-3 text-xs bg-[#16325C] text-white font-semibold rounded-lg text-center"
                >
                  Student Login
                </button>
                <button
                  onClick={() => { onOpenAuth('admin_login'); setMobileMenuOpen(false); }}
                  className="py-2 px-3 text-xs bg-[#A82024] text-white font-semibold rounded-lg text-center"
                >
                  Admin Login
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-xs text-red-600 font-semibold text-center border border-red-200 rounded-lg"
              >
                Sign Out ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
