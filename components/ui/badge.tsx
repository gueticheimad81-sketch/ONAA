export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'destructive' }) {
  const tones = {
    default: 'border border-white/10 bg-white/5 text-slate-200',
    success: 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    warning: 'border border-amber-500/40 bg-amber-500/10 text-amber-300',
    destructive: 'border border-red-500/40 bg-red-500/10 text-red-300',
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${tones[variant]}`}>{children}</span>;
}
