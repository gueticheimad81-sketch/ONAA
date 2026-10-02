import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard, ShieldCheck, UploadCloud } from 'lucide-react';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Checkout</p>
            <h1 className="mt-2 text-3xl font-black">Complete your order</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
            Continue shopping
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: CreditCard, title: 'Pay securely', text: 'Card + crypto + manual payment' },
            { icon: UploadCloud, title: 'Upload proof', text: 'Receipt slip approval workflow' },
            { icon: ShieldCheck, title: 'Instant delivery', text: 'Auto or manual fulfillment' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <Icon className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <CheckoutFlow />
      </div>
    </main>
  );
}
