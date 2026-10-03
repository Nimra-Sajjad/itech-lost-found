import React, { useState } from 'react';
import { ReportReason } from '../oop/types';
import { Flag, X, AlertCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  postTitle: string;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
}

const REPORT_REASONS: ReportReason[] = [
  'Spam',
  'Fake information',
  'Inappropriate content',
  'Wrong information',
  'Duplicate post',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  postTitle,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('Fake information');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a reason.');
      return;
    }
    onSubmit(selectedReason, details);
    setDetails('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 text-[#A82024]">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Report Inappropriate Post</h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">Item: "{postTitle}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#A82024] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Reason:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                    selectedReason === r
                      ? 'border-[#A82024] bg-red-50 text-[#A82024] font-semibold ring-1 ring-[#A82024]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional):
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide context for campus moderators..."
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16325C] focus:border-[#16325C]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#A82024] hover:bg-[#88171B] rounded-lg shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
