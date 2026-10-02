import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import Login from '@/pages/Login';
import Layout, { type PageId } from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import SmsMessages from '@/pages/SmsMessages';
import Recharge from '@/pages/Recharge';
import Balance from '@/pages/Balance';
import Statistics from '@/pages/Statistics';
import Operations from '@/pages/Operations';
import Users from '@/pages/Users';
import Cards from '@/pages/Cards';
import Settings from '@/pages/Settings';

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [page, setPage] = useState<PageId>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !profile) {
    return <Login />;
  }

  // Redirect non-admins away from users page
  const currentPage = page === 'users' && profile.role !== 'admin' ? 'dashboard' : page;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={(p) => setPage(p as PageId)} />;
      case 'sms': return <SmsMessages />;
      case 'recharge': return <Recharge />;
      case 'balance': return <Balance />;
      case 'statistics': return <Statistics />;
      case 'operations': return <Operations />;
      case 'users': return <Users />;
      case 'cards': return <Cards />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={(p) => setPage(p as PageId)} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
