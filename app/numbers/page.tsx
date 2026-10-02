'use client';

import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Plus, Eye, Trash2 } from 'lucide-react';

const phoneNumbers = [
  {
    id: '1',
    number: '0551234567',
    network: 'Mobilis',
    balance: '23,125.34 DA',
    status: 'مكتمل',
    lastRecharge: '2026-10-02',
  },
  {
    id: '2',
    number: '0667654321',
    network: 'Ooredoo',
    balance: '15,500.00 DA',
    status: 'مكتمل',
    lastRecharge: '2026-10-01',
  },
  {
    id: '3',
    number: '0772233445',
    network: 'Djezzy',
    balance: '8,750.50 DA',
    status: 'مكتمل',
    lastRecharge: '2026-09-30',
  },
  {
    id: '4',
    number: '0561112222',
    network: 'Mobilis',
    balance: '0.00 DA',
    status: 'قيد المراجعة',
    lastRecharge: '2026-09-28',
  },
  {
    id: '5',
    number: '0789876543',
    network: 'Ooredoo',
    balance: '45,000.00 DA',
    status: 'مكتمل',
    lastRecharge: '2026-10-02',
  },
];

export default function NumbersPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    network: 'Mobilis',
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">إدارة الأرقام</h1>
        <p className="mt-2 text-sm text-slate-500">عرض وإدارة جميع أرقام الهاتف المسجلة</p>
      </div>

      {/* Action Button */}
      <div className="flex justify-between">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700"
        >
          <Plus className="h-5 w-5" />
          إضافة رقم جديد
        </button>

        {/* Filter */}
        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option>جميع الشبكات</option>
          <option>Mobilis</option>
          <option>Ooredoo</option>
          <option>Djezzy</option>
        </select>
      </div>

      {/* Numbers Table */}
      <DataTable
        title="قائمة الأرقام"
        columns={['الرقم', 'الشبكة', 'الرصيد الحالي', 'الحالة', 'آخر شحن', 'الإجراءات']}
        rows={phoneNumbers.map((num) => ({
          'الرقم': num.number,
          'الشبكة': num.network,
          'الرصيد الحالي': num.balance,
          'الحالة': num.status,
          'آخر شحن': num.lastRecharge,
          'الإجراءات': '⋮',
        }))}
      />

      {/* Add Number Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">إضافة رقم جديد</h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0551234567"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">الشبكة</label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                >
                  <option>Mobilis</option>
                  <option>Ooredoo</option>
                  <option>Djezzy</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
