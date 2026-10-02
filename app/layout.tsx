import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Volca Flexy Dashboard',
  description: 'Platform for managing phone numbers, SMS, and recharges',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
