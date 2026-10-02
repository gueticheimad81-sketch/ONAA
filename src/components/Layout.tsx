import { useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  MessageSquare,
  Smartphone,
  Wallet,
  BarChart3,
  RefreshCw,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'sms'
  | 'recharge'
  | 'balance'
  | 'statistics'
  | 'operations'
  | 'users'
  | 'cards'
  | 'settings';

type NavItem = {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sms', label: 'SMS / Incoming SMS', icon: MessageSquare },
  { id: 'recharge', label: 'Flexy Recharge', icon: Smartphone },
  { id: 'balance', label: 'Balance', icon: Wallet },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'operations', label: 'Operations', icon: RefreshCw },
  { id: 'users', label: 'Users', icon: Users, adminOnly: true },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({
  currentPage,
  onNavigate,
  children,
}: {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const currentLabel = navItems.find((n) => n.id === currentPage)?.label ?? '';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Flexy SMS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
            <button onClick={signOut} className="text-slate-400 hover:text-red-400 transition-colors" title="Sign out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">{currentLabel}</h1>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-700">
                  ${profile.balance.toFixed(2)}
                </span>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                  {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-800 truncate">{profile?.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{isAdmin ? 'Administrator' : 'Standard User'}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('settings'); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
