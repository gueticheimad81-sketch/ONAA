export function Button({ children, className, asChild, variant, ...props }: any) {
  const variants = {
    default: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
    outline: 'border border-white/10 bg-transparent text-white hover:bg-white/5',
  };

  const classes = [
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition',
    variants[variant ?? 'default'],
    className,
  ].join(' ');

  if (asChild) {
    return <div className={classes}>{children}</div>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
