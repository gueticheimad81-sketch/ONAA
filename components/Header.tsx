'use client';

import { Bell, Search, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="بحث..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Settings */}
          <button className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
            <Settings className="h-5 w-5" />
          </button>

          {/* Divider */}
          <div className="w-px bg-slate-200" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
            <div className="hidden text-sm sm:block">
              <p className="font-semibold text-slate-900">أحمد محمد</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
