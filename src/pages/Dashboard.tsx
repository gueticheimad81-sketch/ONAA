import { useEffect, useState } from 'react';
import { supabase, type Operation, type SmsMessage, type Card } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  Wallet,
  MessageSquare,
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
} from 'lucide-react';

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    balance: profile?.balance ?? 0,
    smsCount: 0,
    opsCount: 0,
    cardsCount: 0,
    successfulOps: 0,
    pendingOps: 0,
    failedOps: 0,
    totalRecharged: 0,
  });
  const [recentOps, setRecentOps] = useState<Operation[]>([]);
  const [recentSms, setRecentSms] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isAdmin = profile?.role === 'admin';
      const opsQuery = supabase.from('operations').select('*').order('created_at', { ascending: false });
      if (!isAdmin) opsQuery.eq('user_id', profile?.id);
      const { data: ops } = await opsQuery.limit(100);

      const smsQuery = supabase.from('sms_messages').select('*').order('received_at', { ascending: false });
      if (!isAdmin) smsQuery.eq('user_id', profile?.id);
      const { data: sms } = await smsQuery.limit(100);

      const cardsQuery = supabase.from('cards').select('*').order('created_at', { ascending: false });
      if (!isAdmin) cardsQuery.eq('user_id', profile?.id);
      const { data: cards } = await cardsQuery;

      const allOps = (ops ?? []) as Operation[];
      const allSms = (sms ?? []) as SmsMessage[];

      setStats({
        balance: profile?.balance ?? 0,
        smsCount: allSms.length,
        opsCount: allOps.length,
        cardsCount: cards?.length ?? 0,
        successfulOps: allOps.filter((o) => o.status === 'successful').length,
        pendingOps: allOps.filter((o) => o.status === 'pending').length,
        failedOps: allOps.filter((o) => o.status === 'failed').length,
        totalRecharged: allOps.filter((o) => o.status === 'successful').reduce((sum, o) => sum + o.amount, 0),
      });
      setRecentOps(allOps.slice(0, 5));
      setRecentSms(allSms.slice(0, 5));
      setLoading(false);
    })();
  }, [profile]);

  const statCards = [
    {
      label: 'Balance',
      value: `$${stats.balance.toFixed(2)}`,
      icon: Wallet,
      color: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      label: 'SMS Messages',
      value: stats.smsCount,
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Operations',
      value: stats.opsCount,
      icon: RefreshCw,
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
    },
    {
      label: 'Cards',
      value: stats.cardsCount,
      icon: CreditCard,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-slate-400 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-1">{profile?.full_name || 'User'}</h2>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-slate-300">
                {profile?.role === 'admin' ? 'Administrator' : 'Standard User'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Balance: <span className="font-semibold text-emerald-400">${stats.balance.toFixed(2)}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Successful</p>
              <p className="text-xl font-bold text-slate-800">{stats.successfulOps}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>${stats.totalRecharged.toFixed(2)} total</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-800">{stats.pendingOps}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <Clock className="w-4 h-4" />
            <span>Awaiting processing</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Failed</p>
              <p className="text-xl font-bold text-slate-800">{stats.failedOps}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-red-600">
            <TrendingDown className="w-4 h-4" />
            <span>Needs attention</span>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent operations */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Operations</h3>
            <button onClick={() => onNavigate('operations')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOps.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No operations yet</p>
            ) : (
              recentOps.map((op) => (
                <div key={op.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    op.type === 'recharge' ? 'bg-blue-50' : op.type === 'transfer' ? 'bg-violet-50' : 'bg-amber-50'
                  }`}>
                    {op.type === 'recharge' ? <Smartphone className="w-4 h-4 text-blue-600" /> :
                     op.type === 'transfer' ? <ArrowUpRight className="w-4 h-4 text-violet-600" /> :
                     <ArrowDownLeft className="w-4 h-4 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 capitalize">{op.type}</p>
                    <p className="text-xs text-slate-400">{op.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">${op.amount.toFixed(2)}</p>
                    <StatusBadge status={op.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent SMS */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent SMS</h3>
            <button onClick={() => onNavigate('sms')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentSms.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No messages yet</p>
            ) : (
              recentSms.map((sms) => (
                <div key={sms.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{sms.sender || sms.phone}</p>
                      {sms.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{sms.message_body}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(sms.received_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    successful: 'bg-emerald-50 text-emerald-600',
    pending: 'bg-amber-50 text-amber-600',
    failed: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[status as keyof typeof styles] ?? styles.pending}`}>
      {status}
    </span>
  );
}
