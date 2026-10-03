import React from 'react';
import { UniversityLogo } from '../components/UniversityLogo';
import { Home, Compass, HelpCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
        {/* University Crest */}
        <div className="flex justify-center">
          <UniversityLogo size="md" showText={false} />
        </div>

        {/* 404 Typography matching Rule 27 */}
        <div>
          <span className="text-6xl sm:text-7xl font-extrabold text-[#A82024] font-brand-title block tracking-tight">
            404
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2 font-brand-title">
            Lost page?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Looks like this page couldn't be found.
          </p>
        </div>

        {/* Action Buttons matching Rule 27 */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-5 py-3 bg-[#16325C] hover:bg-[#0F2341] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#A82024]" />
            Browse Lost &amp; Found
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          iTECH (International Institute of Technology, Culture &amp; Health Sciences)
        </div>
      </div>
    </div>
  );
};
