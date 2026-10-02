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
    ID: 'R-101',
    'الهاتف': '0551234567',
    'الشبكة': 'Mobilis',
    'المبلغ': '5,000 DA',
    'المستخدم': 'أحمد محمد',
    'الوقت': '10:45',
    'الحالة': 'مكتمل',
  },
  {
    ID: 'R-102',
    'الهاتف': '0667654321',
    'الشبكة': 'Ooredoo',
    'المبلغ': '2,500 DA',
    'المستخدم': 'سونيا علي',
    'الوقت': '11:20',
    'الحالة': 'قيد التنفيذ',
  },
  {
    ID: 'R-103',
    'الهاتف': '0772233445',
    'الشبكة': 'Djezzy',
    'المبلغ': '12,000 DA',
    'المستخدم': 'ياسين كريم',
    'الوقت': '12:15',
    'الحالة': 'مكتمل',
  },
  {
    ID: 'R-104',
    'الهاتف': '0561112222',
    'الشبكة': 'Mobilis',
    'المبلغ': '3,500 DA',
    'المستخدم': 'فاطمة عمر',
    'الوقت': '13:30',
    'الحالة': 'قيد المراجعة',
  },
  {
    ID: 'R-105',
    'الهاتف': '0789876543',
    'الشبكة': 'Ooredoo',
    'المبلغ': '8,000 DA',
    'المستخدم': 'محمود حسن',
    'الوقت': '14:45',
    'الحالة': 'مكتمل',
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
