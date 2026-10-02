import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'amber';
};

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  amber: 'bg-amber-100 text-amber-600',
};

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">{value}</h3>
          <p className="mt-2 text-xs font-semibold text-emerald-600">{change}</p>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
