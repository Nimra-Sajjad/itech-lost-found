import React from 'react';
import { ShieldCheck, MapPin, Phone, HelpCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface HelpPageProps {
  onNavigate: (view: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16325C] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-bold uppercase text-[#A82024] tracking-widest block">
            Institutional Policy
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand-title mt-1">
            Lost &amp; Found Campus Guidelines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Rules, custody handovers, and identification protocols for iTECH students and staff.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-sm text-[#16325C] mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              1. What to do if you find an item on campus
            </h3>
            <p>
              If you discover an unattended item in classrooms, libraries, or cafeteria:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Submit a post under <strong>"I FOUND SOMETHING"</strong> with accurate location information.</li>
              <li>For high-value items (wallets, laptops, phones, government ID cards), please surrender them immediately to the <strong>Campus Security Office at Gate 1</strong>.</li>
              <li>Do not open sealed envelopes or access personal data on electronic devices.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#A82024]" />
              2. Proving Ownership for Item Recovery
            </h3>
            <p>
              When contacting a finder or claiming from Campus Security, the rightful owner should be prepared to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Present valid <strong>iTECH Student ID</strong>.</li>
              <li>Provide unique identifying marks (lock screen passcode, wallpaper, initials, serial numbers).</li>
              <li>Once successfully recovered, remember to click <strong>"Mark as Resolved"</strong> to update the system.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              3. Unclaimed Belongings &amp; Disposal
            </h3>
            <p>
              Items deposited with the security desk are held for a maximum of <strong>90 days</strong>. If unclaimed:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Academic notebooks and textbooks are handed over to the Department Library.</li>
              <li>Personal effects (clothing, water bottles) in sanitary condition are donated to verified charity drives.</li>
              <li>Identification documents and credit cards are securely shredded or reported to issuing authorities.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Need urgent assistance? Call the 24/7 Security Helpline: <strong>Ext 402</strong>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 bg-[#16325C] text-white text-xs font-bold rounded-xl"
          >
            Return to Browse Items
          </button>
        </div>
      </div>
    </div>
  );
};
