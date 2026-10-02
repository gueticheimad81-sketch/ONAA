export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2.5 text-sm text-white outline-none ring-offset-0 placeholder:text-slate-500 focus:border-cyan-500 ${className}`} {...props} />;
}
