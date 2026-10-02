import { useEffect, useState } from 'react';
import { supabase, type Operation } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Smartphone, Loader2, CheckCircle2, AlertCircle, Wallet, TrendingUp, History } from 'lucide-react';

export default function Recharge() {
  const { profile, refreshProfile } = useAuth();
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('flexy');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Operation[]>([]);

  const quickAmounts = [5, 10, 20, 50, 100, 200];

  useEffect(() => {
    (async () => {
      const isAdmin = profile?.role === 'admin';
      let query = supabase.from('operations').select('*').eq('type', 'recharge').order('created_at', { ascending: false });
      if (!isAdmin) query = query.eq('user_id', profile?.id);
      const { data } = await query.limit(5);
      setHistory((data ?? []) as Operation[]);
    })();
  }, [profile]);

  const handleRecharge = async () => {
    setError(null);
    setSuccess(null);

    if (!phone.trim()) { setError('Please enter a phone number'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Please enter a valid amount'); return; }
    if (profile && amt > profile.balance) { setError('Insufficient balance'); return; }

    setLoading(true);
    const reference = `FLX-${Date.now().toString().slice(-8)}`;
    const { data, error: insertError } = await supabase
      .from('operations')
      .insert({ type: 'recharge', amount: amt, phone, status: 'successful', reference })
      .select()
      .single();

    if (insertError) {
      setError('Failed to process recharge. Please try again.');
      setLoading(false);
      return;
    }

    // Update balance
    if (profile) {
      const newBalance = profile.balance - amt;
      await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
      await refreshProfile();
    }

    setSuccess(`Recharge of $${amt.toFixed(2)} to ${phone} was successful! Reference: ${reference}`);
    setPhone('');
    setAmount('');
    setHistory((prev) => [data as Operation, ...prev].slice(0, 5));
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recharge form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Flexy Recharge</h2>
                <p className="text-sm text-slate-500">Recharge any phone number instantly</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Operator */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Operator</label>
              <div className="grid grid-cols-3 gap-3">
                {['flexy', 'telco', 'mobi'].map((op) => (
                  <button
                    key={op}
                    onClick={() => setOperator(op)}
                    className={`py-3 rounded-xl text-sm font-medium capitalize transition-all border-2 ${
                      operator === op
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="py-2 rounded-lg text-sm font-medium border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            {success && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleRecharge}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
              {loading ? 'Processing...' : 'Recharge Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Balance card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Wallet className="w-4 h-4" /> Current Balance
            </div>
            <p className="text-3xl font-bold">${(profile?.balance ?? 0).toFixed(2)}</p>
            <div className="flex items-center gap-1 mt-3 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" /> Available for recharge
            </div>
          </div>
        </div>

        {/* Recent recharges */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-slate-800 text-sm">Recent Recharges</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {history.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No recharges yet</p>
            ) : (
              history.map((op) => (
                <div key={op.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{op.phone}</p>
                    <p className="text-xs text-slate-400">{new Date(op.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">${op.amount.toFixed(2)}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      op.status === 'successful' ? 'bg-emerald-50 text-emerald-600' :
                      op.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>{op.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
