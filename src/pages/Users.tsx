import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Users as UsersIcon, Search, Shield, Mail, Wallet, Loader2, Ban, CheckCircle2, Crown, X } from 'lucide-react';

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  balance: number;
  status: string;
  phone: string;
  created_at: string;
};

export default function Users() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc('get_all_profiles');
    if (error) {
      setError('Failed to load users. Make sure you have admin access.');
      setLoading(false);
      return;
    }
    setUsers((data ?? []) as ProfileRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    const { error } = await supabase.rpc('update_user_role', {
      target_user_id: userId,
      new_role: newRole,
    });
    if (error) {
      setError(error.message);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
    setUpdating(null);
  };

  const updateStatus = async (userId: string, newStatus: string) => {
    setUpdating(userId);
    const { error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: newStatus,
    });
    if (error) {
      setError(error.message);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    }
    setUpdating(null);
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Shield className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium text-slate-600">Admin Access Required</p>
        <p className="text-sm mt-1">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <UsersIcon className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <X className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <UsersIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Balance</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          u.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>
                          {u.full_name?.[0]?.toUpperCase() ?? u.email[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{u.full_name || 'No name'}</p>
                          <p className="text-xs text-slate-400 sm:hidden truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        ${u.balance.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {u.role === 'admin' && <Crown className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {u.id !== profile?.id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                            disabled={updating === u.id}
                            className="text-xs px-2.5 py-1.5 rounded-lg font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => updateStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                            disabled={updating === u.id}
                            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors disabled:opacity-50 ${
                              u.status === 'active'
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      )}
                      {u.id === profile?.id && (
                        <span className="text-xs text-slate-400 italic">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
