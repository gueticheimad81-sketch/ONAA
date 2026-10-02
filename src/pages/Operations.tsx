import { useEffect, useState } from 'react';
import { supabase, type Operation } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Search, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle, Smartphone, ArrowUpRight, ArrowDownLeft, Filter, X } from 'lucide-react';

const PAGE_SIZE = 10;

export default function Operations() {
  const { profile } = useAuth();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'successful' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'recharge' | 'transfer' | 'withdrawal'>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const isAdmin = profile?.role === 'admin';
      let query = supabase.from('operations').select('*', { count: 'exact' }).order('created_at', { ascending: false });
      if (!isAdmin) query = query.eq('user_id', profile?.id);
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      if (typeFilter !== 'all') query = query.eq('type', typeFilter);
      if (search.trim()) {
        query = query.or(`phone.ilike.%${search}%,reference.ilike.%${search}%,type.ilike.%${search}%`);
      }
      query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      const { data, count } = await query;
      setOperations((data ?? []) as Operation[]);
      setTotal(count ?? 0);
      setLoading(false);
    })();
  }, [profile, page, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const typeIcons: Record<string, typeof Smartphone> = {
    recharge: Smartphone,
    transfer: ArrowUpRight,
    withdrawal: ArrowDownLeft,
  };

  const typeColors: Record<string, string> = {
    recharge: 'bg-blue-50 text-blue-600',
    transfer: 'bg-violet-50 text-violet-600',
    withdrawal: 'bg-amber-50 text-amber-600',
  };

  const statusIcons: Record<string, typeof CheckCircle2> = {
    successful: CheckCircle2,
    pending: Clock,
    failed: XCircle,
  };

  const statusColors: Record<string, string> = {
    successful: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    failed: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by phone, reference, or type..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'successful', 'pending', 'failed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                statusFilter === s ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as typeof typeFilter); setPage(0); }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="all">All Types</option>
          <option value="recharge">Recharge</option>
          <option value="transfer">Transfer</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>

      {/* Active filters */}
      {(statusFilter !== 'all' || typeFilter !== 'all' || search) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Active filters:</span>
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium capitalize">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {typeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium capitalize">
              Type: {typeFilter}
              <button onClick={() => setTypeFilter('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
              "{search}"
              <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : operations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <RefreshCw className="w-12 h-12 mb-2" />
            <p className="text-sm">No operations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Phone</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Reference</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {operations.map((op) => {
                  const TypeIcon = typeIcons[op.type] ?? Smartphone;
                  const StatusIcon = statusIcons[op.status] ?? Clock;
                  return (
                    <tr key={op.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[op.type] ?? 'bg-slate-100'}`}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 capitalize">{op.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{op.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">${op.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 font-mono text-xs">{op.reference || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[op.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {op.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 hidden sm:table-cell whitespace-nowrap">
                        {new Date(op.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page + 1} of {totalPages} — {total} operations
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
    </div>
  );
}
