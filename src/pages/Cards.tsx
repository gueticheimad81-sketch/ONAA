import { useEffect, useState } from 'react';
import { supabase, type Card as CardType } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { CreditCard, Plus, X, Loader2, Trash2, ShieldCheck } from 'lucide-react';

export default function Cards() {
  const { profile } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ card_number: '', holder_name: '', balance: '', expiry_date: '' });
  const [saving, setSaving] = useState(false);

  const fetchCards = async () => {
    const isAdmin = profile?.role === 'admin';
    let query = supabase.from('cards').select('*').order('created_at', { ascending: false });
    if (!isAdmin) query = query.eq('user_id', profile?.id);
    const { data } = await query;
    setCards((data ?? []) as CardType[]);
    setLoading(false);
  };

  useEffect(() => { fetchCards(); }, [profile]);

  const handleAdd = async () => {
    if (!form.card_number.trim() || !form.holder_name.trim()) return;
    setSaving(true);
    await supabase.from('cards').insert({
      card_number: form.card_number,
      holder_name: form.holder_name,
      balance: parseFloat(form.balance) || 0,
      expiry_date: form.expiry_date,
      status: 'active',
    });
    setForm({ card_number: '', holder_name: '', balance: '', expiry_date: '' });
    setShowForm(false);
    setSaving(false);
    fetchCards();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('cards').delete().eq('id', id);
    fetchCards();
  };

  const toggleBlock = async (card: CardType) => {
    const newStatus = card.status === 'active' ? 'blocked' : 'active';
    await supabase.from('cards').update({ status: newStatus }).eq('id', card.id);
    fetchCards();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">My Cards</h2>
            <p className="text-sm text-slate-500">{cards.length} cards linked</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      {/* Cards grid */}
      {cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No cards yet</p>
          <p className="text-sm text-slate-400 mt-1">Add a card to start managing your funds</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative rounded-2xl p-6 text-white overflow-hidden ${
                card.status === 'active'
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                  : 'bg-gradient-to-br from-slate-400 to-slate-500'
              }`}
            >
              {/* Decoration */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500" />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {card.status}
                  </span>
                </div>

                <p className="text-lg font-mono tracking-wider mb-4">
                  {card.card_number.replace(/(.{4})/g, '$1 ').trim()}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Card Holder</p>
                    <p className="text-sm font-medium">{card.holder_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-0.5">Balance</p>
                    <p className="text-lg font-bold">${card.balance.toFixed(2)}</p>
                  </div>
                </div>

                {card.expiry_date && (
                  <p className="text-xs text-slate-400 mt-3">Expires: {card.expiry_date}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-5 pt-4 border-t border-white/10">
                  <button
                    onClick={() => toggleBlock(card)}
                    className="flex-1 text-xs py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                  >
                    {card.status === 'active' ? 'Block' : 'Unblock'}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-xs py-1.5 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add card modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Add New Card</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={form.card_number}
                  onChange={(e) => setForm({ ...form, card_number: e.target.value.replace(/[^0-9]/g, '').slice(0, 16) })}
                  placeholder="1234567890123456"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Holder Name</label>
                <input
                  type="text"
                  value={form.holder_name}
                  onChange={(e) => setForm({ ...form, holder_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Balance</label>
                  <input
                    type="number"
                    value={form.balance}
                    onChange={(e) => setForm({ ...form, balance: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4" /> Your card information is encrypted and secure
              </div>
              <button
                onClick={handleAdd}
                disabled={saving || !form.card_number || !form.holder_name}
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
