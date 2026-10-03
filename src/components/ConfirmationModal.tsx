import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'success' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: 'bg-[#A82024] hover:bg-[#88171B] text-white',
      icon: <AlertTriangle className="w-6 h-6 text-[#A82024]" />,
      iconBg: 'bg-red-50',
    },
    success: {
      button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
    },
    primary: {
      button: 'bg-[#16325C] hover:bg-[#0F2341] text-white',
      icon: <AlertTriangle className="w-6 h-6 text-[#16325C]" />,
      iconBg: 'bg-blue-50',
    },
  };

  const currentVariant = variantStyles[confirmVariant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${currentVariant.iconBg}`}>
              {currentVariant.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-xs ${currentVariant.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
