'use client';

import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Search, Archive, Trash2 } from 'lucide-react';

const smsMessages = [
  {
    id: '1',
    from: '0551234567',
    message: 'مرحباً، هل يمكنك تأكيد الطلب؟',
    date: '2026-10-02',
    time: '10:45',
    status: 'مكتمل',
  },
  {
    id: '2',
    from: '0667654321',
    message: 'تم استقبال الرسالة بنجاح',
    date: '2026-10-02',
    time: '11:20',
    status: 'مكتمل',
  },
  {
    id: '3',
    from: '0772233445',
    message: 'هل هناك أي تحديثات جديدة؟',
    date: '2026-10-02',
    time: '12:15',
    status: 'مكتمل',
  },
  {
    id: '4',
    from: '0561112222',
    message: 'شكراً على الخدمة الممتازة',
    date: '2026-10-01',
    time: '14:30',
    status: 'مكتمل',
  },
  {
    id: '5',
    from: '0789876543',
    message: 'يرجى إرسال المزيد من المعلومات',
    date: '2026-10-01',
    time: '15:45',
    status: 'مكتمل',
  },
];

export default function SMSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const filteredMessages = smsMessages.filter(
    (msg) =>
      msg.from.includes(searchTerm) ||
      msg.message.includes(searchTerm) ||
      msg.date.includes(searchTerm)
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">الرسائل القصيرة</h1>
        <p className="mt-2 text-sm text-slate-500">عرض وإدارة جميع الرسائل الواردة</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن رسالة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-10 pl-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option>كل الرسائل</option>
          <option>جديد</option>
          <option>مقروءة</option>
          <option>مؤرشفة</option>
        </select>
      </div>

      {/* SMS List */}
      <div className="space-y-2">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{msg.from}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {msg.date} {msg.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{msg.message.substring(0, 60)}...</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  عرض
                </button>
              </div>
            </div>

            {/* Expanded Message */}
            {expandedMessage === msg.id && (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-700">{msg.message}</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                    <Archive className="h-4 w-4" />
                    أرشيف
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100">
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          إظهار 1 إلى {filteredMessages.length} من {smsMessages.length} رسالة
        </p>
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            السابق
          </button>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
