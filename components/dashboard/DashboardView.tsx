import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Clock3, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';

export function DashboardView() {
  const stats = [
    { label: 'Pending', value: '8', accent: 'amber' },
    { label: 'Completed', value: '184', accent: 'green' },
    { label: 'Revenue', value: '$12.4K', accent: 'blue' },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black">Customer overview</h1>
        </div>
        <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">New order</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">{stat.label}</CardDescription>
              <CardTitle className="text-3xl font-black">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'ORD-1042', service: 'Netflix Premium', status: 'pending_verification', amount: '$12.99' },
              { id: 'ORD-1041', service: 'Mobile Recharge', status: 'delivered', amount: '$25.00' },
              { id: 'ORD-1039', service: 'CapCut Pro', status: 'processing', amount: '$8.99' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div>
                  <p className="font-semibold">{order.service}</p>
                  <p className="text-sm text-slate-400">{order.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'pending_verification' ? 'warning' : 'default'}>
                    {order.status}
                  </Badge>
                  <span className="font-semibold">{order.amount}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03] text-white">
          <CardHeader>
            <CardTitle>Activation vault</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <Check className="mb-2 h-5 w-5" />
              CapCut Pro license activated successfully.
            </div>
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
              <ShieldCheck className="mb-2 h-5 w-5" />
              Secure credentials stored for this order.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
