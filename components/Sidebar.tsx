'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/numbers',
    label: 'الأرقام',
    icon: Smartphone,
  },
  {
    href: '/sms',
    label: 'الرسائل',
    icon: MessageSquare,
  },
  {
    href: '/transactions',
    label: 'المعاملات',
    icon: CreditCard,
  },
  {
    href: '/users',
    label: 'المستخدمون',
    icon: Users,
  },
  {
    href: '/admin',
    label: 'Admin Panel',
    icon: Shield,
  },
  {
    href: '/settings',
    label: 'الإعدادات',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-l border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <div className="text-2xl font-black tracking-tighter">VOLCA FLEXY</div>
        <div className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Control Panel</div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-1 overflow-y-auto px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-700" />

      {/* Bottom Section */}
      <div className="px-3 pb-6">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
