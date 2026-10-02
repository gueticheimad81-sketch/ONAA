export function Label({ children, className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`block text-sm font-medium text-slate-300 ${className}`} {...props}>{children}</label>;
}
