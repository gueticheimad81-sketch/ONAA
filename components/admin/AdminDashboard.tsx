import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock3, CreditCard, Download, Search, ShieldCheck, UploadCloud } from 'lucide-react';

export function AdminDashboard() {
  const orders = [
    { id: 'ORD-2048', customer: 'Aisha K.', total: '$49.99', status: 'pending_verification' },
    { id: 'ORD-2047', customer: 'Daniel R.', total: '$19.99', status: 'approved' },
    { id: 'ORD-2046', customer: 'Maria W.', total: '$85.00', status: 'rejected' },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Admin</p>
          <h1 className="mt-2 text-3xl font-black">Fulfillment hub</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export</Button>
          <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">New product</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Gross revenue', value: '$46.7K' },
          { label: 'Pending orders', value: '14' },
          { label: 'Completed', value: '228' },
          { label: 'Top service', value: 'Netflix' },
        ].map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-black">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Manual approval queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">{order.customer}</p>
                <p className="text-sm text-slate-400">{order.id} • {order.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={order.status === 'approved' ? 'success' : order.status === 'pending_verification' ? 'warning' : 'destructive'}>
                  {order.status}
                </Badge>
                <Button variant="outline" className="border-emerald-500/40 text-emerald-300">Approve</Button>
                <Button variant="outline" className="border-red-500/40 text-red-300">Reject</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
