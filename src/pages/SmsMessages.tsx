import { useEffect, useState, useCallback } from 'react';
import { supabase, type SmsMessage } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Search, MessageSquare, Inbox, ChevronLeft, ChevronRight, Mail, MailOpen, Trash2, X } from 'lucide-react';

const PAGE_SIZE = 10;

export default function SmsMessages() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<SmsMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const isAdmin = profile?.role === 'admin';
    let query = supabase.from('sms_messages').select('*', { count: 'exact' }).order('received_at', { ascending: false });
    if (!isAdmin) query = query.eq('user_id', profile?.id);
    if (filter !== 'all') query = query.eq('status', filter);
    if (search.trim()) {
      query = query.or(`phone.ilike.%${search}%,sender.ilike.%${search}%,message_body.ilike.%${search}%`);
    }
    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await query;
    setMessages((data ?? []) as SmsMessage[]);
    setTotal(count ?? 0);
    setLoading(false);
  }, [profile, page, search, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markAsRead = async (msg: SmsMessage) => {
    if (msg.status === 'unread') {
      await supabase.from('sms_messages').update({ status: 'read' }).eq('id', msg.id);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m)));
    }
    setSelected({ ...msg, status: 'read' });
  };

  const deleteMessage = async (id: string) => {
    await supabase.from('sms_messages').delete().eq('id', id);
    setSelected(null);
    fetchMessages();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by phone, sender, or message content..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Messages table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Inbox className="w-12 h-12 mb-2" />
            <p className="text-sm">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markAsRead(msg)}
                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${msg.status === 'unread' ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.status === 'unread' ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  {msg.status === 'unread' ? <Mail className="w-5 h-5 text-blue-600" /> : <MailOpen className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm ${msg.status === 'unread' ? 'font-semibold' : 'font-medium'} text-slate-800`}>
                      {msg.sender || 'Unknown'}
                    </p>
                    {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{msg.message_body}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{msg.phone}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                  {new Date(msg.received_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page + 1} of {totalPages} — {total} messages
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Message detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{selected.sender || 'Unknown Sender'}</h3>
                  <p className="text-xs text-slate-400">{selected.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-500 mb-1">Received</p>
              <p className="text-sm text-slate-700 mb-4">{new Date(selected.received_at).toLocaleString()}</p>
              <p className="text-sm text-slate-500 mb-1">Message</p>
              <p className="text-sm text-slate-800 bg-slate-50 rounded-lg p-4 leading-relaxed">{selected.message_body}</p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => deleteMessage(selected.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setSelected(null)}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
