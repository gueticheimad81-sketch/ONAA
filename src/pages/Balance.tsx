import { useEffect, useState } from 'react';
import { supabase, type Operation } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Smartphone, Loader2 } from 'lucide-react';

export default function Balance() {
  const { profile, refreshProfile } = useAuth();
  const [history, setHistory] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const isAdmin = profile?.role === 'admin';
      let query = supabase.from('operations').select('*').order('created_at', { ascending: false });
      if (!isAdmin) query = query.eq('user_id', profile?.id);
      const { data } = await query.limit(20);
      setHistory((data ?? []) as Operation[]);
      setLoading(false);
    })();
  }, [profile]);

  const handleTopUp = async () => {
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    setTopUpLoading(true);
    const reference = `TOP-${Date.now().toString().slice(-8)}`;
    await supabase.from('operations').insert({
      type: 'withdrawal', amount: -amt, phone: '—', status: 'successful', reference,
    });
    if (profile) {
      const newBalance = profile.balance + amt;
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
      await refreshProfile();
    }
    setTopUpAmount('');
    setTopUpLoading(false);
    // Refresh history
    const isAdmin = profile?.role === 'admin';
    let q = supabase.from('operations').select('*').order('created_at', { ascending: false });
    if (!isAdmin) q = q.eq('user_id', profile?.id);
    const { data } = await q.limit(20);
    setHistory((data ?? []) as Operation[]);
  };

  const totalIn = history.filter((h) => h.status === 'successful' && h.amount > 0).reduce((s, h) => s + h.amount, 0);
  const totalOut = history.filter((h) => h.status === 'successful' && h.amount < 0).reduce((s, h) => s + Math.abs(h.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <Wallet className="w-4 h-4" /> Total Balance
            </div>
            <p className="text-4xl lg:text-5xl font-bold">${(profile?.balance ?? 0).toFixed(2)}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" /> Total In
                </div>
                <p className="text-xl font-bold text-white">${totalIn.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" /> Total Out
                </div>
                <p className="text-xl font-bold text-white">${totalOut.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top up card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Top Up Balance</h3>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[10, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt.toString())}
                  className="py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button
              onClick={handleTopUp}
              disabled={topUpLoading || !topUpAmount}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {topUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Transaction History</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {history.length === 0 ? (
            <p className="px-5 py-8 text-center text-slate-400 text-sm">No transactions yet</p>
          ) : (
            history.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.amount >= 0 ? 'bg-emerald-50' : 'bg-red-50'
                }`}>
                  {tx.type === 'recharge' ? <Smartphone className="w-5 h-5 text-blue-600" /> :
                   tx.amount >= 0 ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" /> :
                   <ArrowUpRight className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 capitalize">{tx.type}</p>
                  <p className="text-xs text-slate-400">{tx.phone} — {new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${
                    tx.status === 'successful' ? 'bg-emerald-50 text-emerald-600' :
                    tx.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>{tx.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
