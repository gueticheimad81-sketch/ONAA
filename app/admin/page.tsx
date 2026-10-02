'use client';

import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

const pendingOrders = [
  {
    ID: 'ORD-001',
    'المستخدم': 'أحمد محمد',
    'الهاتف': '0551234567',
    'المبلغ': '5,000 DA',
    'الشبكة': 'Mobilis',
    'الحالة': 'قيد المراجعة',
  },
  {
    ID: 'ORD-002',
    'المستخدم': 'سونيا علي',
    'الهاتف': '0667654321',
    'المبلغ': '2,500 DA',
    'الشبكة': 'Ooredoo',
    'الحالة': 'قيد المراجعة',
  },
  {
    ID: 'ORD-003',
    'المستخدم': 'ياسين كريم',
    'الهاتف': '0772233445',
    'المبلغ': '12,000 DA',
    'الشبكة': 'Djezzy',
    'الحالة': 'قيد المراجعة',
  },
];

const adminActions = [
  { icon: Plus, label: 'إضافة رقم', color: 'blue' },
  { icon: Edit, label: 'تعديل البيانات', color: 'amber' },
  { icon: Trash2, label: 'حذف', color: 'red' },
  { icon: Check, label: 'الموافقة', color: 'green' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">لوحة الإدارة</h1>
        <p className="mt-2 text-sm text-slate-500">إدارة شاملة للنظام والمستخدمين والعمليات</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminActions.map((action) => {
          const Icon = action.icon;
          const colorClass = {
            blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
            red: 'bg-red-100 text-red-600 hover:bg-red-200',
            green: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
          }[action.color];

          return (
            <button
              key={action.label}
              className={`rounded-2xl border border-slate-200 p-6 text-center transition ${colorClass}`}
            >
              <Icon className="mx-auto h-8 w-8" />
              <p className="mt-3 font-semibold">{action.label}</p>
            </button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 bg-white">
        {[
          { id: 'orders', label: 'الطلبيات المعلقة' },
          { id: 'users', label: 'المستخدمون' },
          { id: 'logs', label: 'سجل العمليات' },
          { id: 'settings', label: 'الإعدادات' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-3 font-medium transition ${
              activeTab === tab.id
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <DataTable
            title="الطلبيات المعلقة للمراجعة"
            columns={['ID', 'المستخدم', 'الهاتف', 'المبلغ', 'الشبكة', 'الحالة']}
            rows={pendingOrders}
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700">
              <Check className="h-4 w-4" />
              الموافقة على الكل
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
              رفض المحدد
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">إدارة المستخدمين</h2>
          <p className="text-slate-600">إضافة مستخدمين جدد وتعديل صلاحياتهم</p>
          <button className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">
            + إضافة مستخدم جديد
          </button>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">سجل التغييرات</h2>
          <DataTable
            title="جميع العمليات"
            columns={['التاريخ', 'النوع', 'المستخدم', 'الإجراء', 'التفاصيل']}
            rows={[
              { التاريخ: '2026-10-02', النوع: 'شحن', المستخدم: 'أحمد', الإجراء: 'تم', التفاصيل: '5000 DA' },
            ]}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">إعدادات النظام</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">حد أدنى للشحن (DA)</label>
              <input type="number" defaultValue="500" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">حد أقصى للشحن (DA)</label>
              <input type="number" defaultValue="100000" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </div>
            <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
