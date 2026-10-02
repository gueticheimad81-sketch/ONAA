import { useEffect, useState, useMemo } from 'react';
import { supabase, type Operation } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { TrendingUp, TrendingDown, BarChart3, Smartphone, RefreshCw, Calendar } from 'lucide-react';

export default function Statistics() {
  const { profile } = useAuth();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isAdmin = profile?.role === 'admin';
      let query = supabase.from('operations').select('*').order('created_at', { ascending: true });
      if (!isAdmin) query = query.eq('user_id', profile?.id);
      const { data } = await query;
      setOperations((data ?? []) as Operation[]);
      setLoading(false);
    })();
  }, [profile]);

  const filteredOps = useMemo(() => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return operations.filter((op) => new Date(op.created_at) >= cutoff);
  }, [operations, period]);

  const stats = useMemo(() => {
    const successful = filteredOps.filter((o) => o.status === 'successful');
    const total = successful.reduce((s, o) => s + Math.abs(o.amount), 0);
    const rechargeTotal = successful.filter((o) => o.type === 'recharge').reduce((s, o) => s + o.amount, 0);
    const transferTotal = successful.filter((o) => o.type === 'transfer').reduce((s, o) => s + Math.abs(o.amount), 0);
    const withdrawalTotal = successful.filter((o) => o.type === 'withdrawal').reduce((s, o) => s + Math.abs(o.amount), 0);
    const avgAmount = successful.length > 0 ? total / successful.length : 0;
    const successRate = filteredOps.length > 0 ? (successful.length / filteredOps.length) * 100 : 0;

    // Daily breakdown for chart
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const dailyData: { date: string; amount: number; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toDateString();
      const dayOps = successful.filter((o) => new Date(o.created_at).toDateString() === dayStr);
      dailyData.push({
        date: day.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        amount: dayOps.reduce((s, o) => s + Math.abs(o.amount), 0),
        count: dayOps.length,
      });
    }

    return {
      total, rechargeTotal, transferTotal, withdrawalTotal,
      avgAmount, successRate, totalOps: filteredOps.length,
      successful: successful.length, pending: filteredOps.filter((o) => o.status === 'pending').length,
      failed: filteredOps.filter((o) => o.status === 'failed').length,
      dailyData,
    };
  }, [filteredOps, period]);

  const maxDailyAmount = Math.max(...stats.dailyData.map((d) => d.amount), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Volume', value: `$${stats.total.toFixed(2)}`, icon: BarChart3, color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg per Operation', value: `$${stats.avgAmount.toFixed(2)}`, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Success Rate', value: `${stats.successRate.toFixed(1)}%`, icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
    { label: 'Total Operations', value: stats.totalOps, icon: RefreshCw, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-400" />
        {(['7d', '30d', '90d'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === p ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-1">Daily Volume</h3>
        <p className="text-sm text-slate-500 mb-6">Transaction amounts over time</p>
        <div className="flex items-end gap-1 h-48 overflow-x-auto">
          {stats.dailyData.map((d, i) => (
            <div key={i} className="flex-1 min-w-[8px] flex flex-col items-center group relative">
              <div className="w-full relative flex flex-col justify-end h-full">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5">
                    <p className="font-medium">{d.date}</p>
                    <p className="text-slate-300">${d.amount.toFixed(2)} — {d.count} ops</p>
                  </div>
                </div>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-md transition-all hover:from-blue-600 hover:to-cyan-500 min-h-[2px]"
                  style={{ height: `${(d.amount / maxDailyAmount) * 100}%` }}
                />
              </div>
              {(period === '7d' || i % Math.ceil(stats.dailyData.length / 10) === 0) && (
                <span className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">{d.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By type */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">By Type</h3>
          <div className="space-y-4">
            {[
              { label: 'Recharge', value: stats.rechargeTotal, color: 'bg-blue-500', icon: Smartphone },
              { label: 'Transfer', value: stats.transferTotal, color: 'bg-violet-500', icon: TrendingUp },
              { label: 'Withdrawal', value: stats.withdrawalTotal, color: 'bg-amber-500', icon: TrendingDown },
            ].map((item) => {
              const max = Math.max(stats.rechargeTotal, stats.transferTotal, stats.withdrawalTotal, 1);
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">${item.value.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${(item.value / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">By Status</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                {stats.totalOps > 0 && (
                  <>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12"
                      strokeDasharray={`${(stats.successful / stats.totalOps) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12"
                      strokeDasharray={`${(stats.pending / stats.totalOps) * 251.2} 251.2`}
                      strokeDashoffset={`-${(stats.successful / stats.totalOps) * 251.2}`}
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="12"
                      strokeDasharray={`${(stats.failed / stats.totalOps) * 251.2} 251.2`}
                      strokeDashoffset={`-${((stats.successful + stats.pending) / stats.totalOps) * 251.2}`}
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">{stats.totalOps}</p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Successful</p>
              <p className="text-sm font-semibold text-slate-800">{stats.successful}</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-sm font-semibold text-slate-800">{stats.pending}</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Failed</p>
              <p className="text-sm font-semibold text-slate-800">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
