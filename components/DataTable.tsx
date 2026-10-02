'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type DataTableProps = {
  title: string;
  columns: string[];
  rows: Record<string, string | number | undefined>[];
};

export function DataTable({ title, columns, rows }: DataTableProps) {
  const statusColorMap: Record<string, string> = {
    'مكتمل': 'bg-emerald-100 text-emerald-700',
    'قيد التنفيذ': 'bg-blue-100 text-blue-700',
    'قيد المراجعة': 'bg-amber-100 text-amber-700',
    'فشل': 'bg-red-100 text-red-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-right font-semibold text-slate-700"
                >
                  <div className="flex items-center justify-between gap-2">
                    {col}
                    {col !== 'ID' && (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {rows.map((row, idx) => (
              <tr key={idx} className="transition hover:bg-slate-50">
                {columns.map((col) => {
                  const value = row[col] ?? '-';
                  const isStatus = col === 'الحالة';

                  return (
                    <td key={col} className="px-6 py-4 text-slate-700">
                      {isStatus ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusColorMap[String(value)] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {value}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-6 py-4">
        <p className="text-xs text-slate-500">إظهار 1 إلى {rows.length} من {rows.length} نتيجة</p>
      </div>
    </div>
  );
}
