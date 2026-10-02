"use client";

import { useState } from 'react';
import { CreditCard, UploadCloud, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CheckoutFlow() {
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'stripe' | 'crypto'>('manual');

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Order details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Full name</Label>
              <Input id="customerName" placeholder="Jane Doe" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@example.com" className="mt-2" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" placeholder="+1 555 123 4567" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="variant">Plan</Label>
              <Input id="variant" value="1 Month" className="mt-2" readOnly />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="mb-3 font-medium">Payment method</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { key: 'manual', label: 'Manual', icon: UploadCloud },
                { key: 'stripe', label: 'Card', icon: CreditCard },
                { key: 'crypto', label: 'Crypto', icon: Wallet },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaymentMethod(key as 'manual' | 'stripe' | 'crypto')}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                    paymentMethod === key
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'manual' && (
            <div className="rounded-2xl border border-dashed border-cyan-500/40 bg-cyan-500/5 p-4">
              <p className="font-medium text-cyan-300">Upload proof of payment</p>
              <p className="mt-1 text-sm text-slate-300">Receipt or screenshot will go to waiting review status.</p>
              <input type="file" className="mt-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-slate-950" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03] text-white">
        <CardHeader>
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div>
              <p className="font-semibold">Netflix Premium</p>
              <p className="text-sm text-slate-400">1 Month</p>
            </div>
            <p className="text-xl font-black">$12.99</p>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between"><span>Subtotal</span><span>$12.99</span></div>
            <div className="flex justify-between"><span>Processing fee</span><span>$0.00</span></div>
            <div className="flex justify-between text-white"><span>Total</span><span className="text-xl font-black">$12.99</span></div>
          </div>

          <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">Confirm order</Button>
        </CardContent>
      </Card>
    </div>
  );
}
