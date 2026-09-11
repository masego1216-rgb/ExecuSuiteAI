import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-gold-500" />;
}

export function FullPageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-gold-500" />
        <p className="text-sm text-charcoal-400">{label}</p>
      </div>
    </div>
  );
}

export function AIGenerating({ label = 'AI is generating...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-gold-600" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal-700">{label}</p>
        <p className="text-xs text-charcoal-400">This usually takes a few seconds...</p>
      </div>
      <div className="flex-1 ml-3">
        <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-300 to-gold-500 rounded-full animate-shimmer bg-[length:200%_100%]" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-charcoal-300" />
      </div>
      <h3 className="text-base font-semibold text-charcoal-700">{title}</h3>
      <p className="text-sm text-charcoal-400 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
