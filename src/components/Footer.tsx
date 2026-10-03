import React from 'react';
import { UniversityLogo } from './UniversityLogo';
import { Shield, Phone, Mail, MapPin, ExternalLink, Code2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F2341] text-white border-t-4 border-[#A82024] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: University Identity */}
          <div className="md:col-span-2 space-y-4">
            <UniversityLogo size="lg" textColor="light" />
            <p className="text-xs text-slate-300 max-w-md leading-relaxed mt-2">
              The official centralized Lost &amp; Found repository for the students, faculty, and administrative community of <strong>iTECH</strong> (International Institute of Technology, Culture &amp; Health Sciences). Helping reconnect individuals with their lost belongings quickly, securely, and transparently.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] text-blue-200 border border-white/15">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Verified Campus Service
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Rule 30) */}
          <div>
            <h4 className="font-brand-title font-bold text-sm tracking-wider uppercase text-blue-200 mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home / Everything
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lost')}
                  className="hover:text-white transition-colors"
                >
                  Lost Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('found')}
                  className="hover:text-white transition-colors"
                >
                  Found Items
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create-post')}
                  className="hover:text-white transition-colors"
                >
                  Report Lost / Found
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-white transition-colors"
                >
                  Lost &amp; Found Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Campus Contact Details */}
          <div>
            <h4 className="font-brand-title font-bold text-sm tracking-wider uppercase text-blue-200 mb-4">
              Campus Security &amp; Care
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A82024] shrink-0 mt-0.5" />
                <span>Central Campus Security Office, Gate 1, iTECH University Complex</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+92 300 8472910 / Helpline: Ext 402</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <span>security.affairs@itech.edu.pk</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Hours: Mon–Sat, 08:00 AM – 08:00 PM for in-person item custody claims.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 iTECH (International Institute of Technology, Culture &amp; Health Sciences). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Role-Based Access Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
