import { Check, Clock3, Sparkles } from 'lucide-react';

export function ProductDetailView({ product }: { product: { id: string; name: string; category: string; badge: string; description: string; variants: Array<{ id: string; name: string; price: number }>; inputRequirements: string[]; }; }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
            {product.badge}
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">{product.category}</div>
        </div>

        <h2 className="text-4xl font-black text-white">{product.name}</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{product.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            'Instant delivery after payment confirmation',
            'Secure account verification flow',
            'Flexible pricing tiers',
            'Live support for issues',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <Check className="h-4 w-4 text-cyan-300" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-6 shadow-neon">
        <h3 className="text-xl font-bold text-white">Select a plan</h3>
        <div className="mt-5 space-y-3">
          {product.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div>
                <p className="font-medium text-white">{variant.name}</p>
                <p className="text-sm text-slate-400">Digital delivery</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">${variant.price}</p>
                <a href="/checkout" className="mt-2 inline-flex rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950">Buy now</a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 text-cyan-300">
            <Clock3 className="h-4 w-4" />
            <span>Average delivery time: 2-10 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
