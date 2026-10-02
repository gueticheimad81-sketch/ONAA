'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { TrendingUp, Users, CreditCard, Smartphone } from 'lucide-react';

const stats = [
  {
    title: 'عدد الأرقام',
    value: '658',
    change: '+12%',
    icon: Smartphone,
    color: 'blue',
  },
  {
    title: 'إجمالي عمليات الشحن',
    value: '1,284',
    change: '+8%',
    icon: TrendingUp,
    color: 'green',
  },
  {
    title: 'إجمالي المبالغ',
    value: '23,125.34 DA',
    change: '+15%',
    icon: CreditCard,
    color: 'purple',
  },
  {
    title: 'الرصيد',
    value: '145,000 DA',
    change: '+5%',
    icon: Users,
    color: 'amber',
  },
];

const recentOperations = [
  {
    id: 'R-101',
    phone: '0551234567',
    network: 'Mobilis',
    amount: '5,000 DA',
    user: 'أحمد محمد',
    time: '10:45',
    status: 'مكتمل',
  },
  {
    id: 'R-102',
    phone: '0667654321',
    network: 'Ooredoo',
    amount: '2,500 DA',
    user: 'سونيا علي',
    time: '11:20',
    status: 'قيد التنفيذ',
  },
  {
    id: 'R-103',
    phone: '0772233445',
    network: 'Djezzy',
    amount: '12,000 DA',
    user: 'ياسين كريم',
    time: '12:15',
    status: 'مكتمل',
  },
  {
    id: 'R-104',
    phone: '0561112222',
    network: 'Mobilis',
    amount: '3,500 DA',
    user: 'فاطمة عمر',
    time: '13:30',
    status: 'قيد المراجعة',
  },
  {
    id: 'R-105',
    phone: '0789876543',
    network: 'Ooredoo',
    amount: '8,000 DA',
    user: 'محمود حسن',
    time: '14:45',
    status: 'مكتمل',
  },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">لوحة التحكم الرئيسية</h1>
        <p className="mt-2 text-sm text-slate-500">مرحباً بك في منصة Volca Flexy - إجمالي نشاط النظام</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Operations Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Operations */}
        <div className="lg:col-span-2">
          <DataTable
            title="آخر العمليات"
            columns={['ID', 'الهاتف', 'الشبكة', 'المبلغ', 'المستخدم', 'الوقت', 'الحالة']}
            rows={recentOperations}
          />
        </div>

        {/* Quick Stats Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600">معلومات سريعة</h3>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">قيد الانتظار</span>
                <span className="font-semibold text-slate-900">24</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">مكتمل اليوم</span>
                <span className="font-semibold text-slate-900">156</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">معدل النجاح</span>
                <span className="font-semibold text-emerald-600">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">آخر تحديث</span>
                <span className="font-semibold text-slate-900">الآن</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700">
              عملية شحن جديدة
            </button>
            <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50">
              عرض جميع العمليات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
