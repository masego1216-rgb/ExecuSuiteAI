import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-large border border-cream-200 animate-scale-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between p-5 border-b border-cream-200">
          <div>
            <h2 className="text-lg font-semibold text-charcoal-800">{title}</h2>
            {subtitle && <p className="text-sm text-charcoal-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-cream-200 bg-cream-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
