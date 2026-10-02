import { ArrowRight, CreditCard, PackageCheck, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ProductCatalog({ products }: { products: Array<{ id: string; name: string; slug: string; category: string; badge: string; description: string; variants: Array<{ id: string; name: string; price: number }>; }> }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="group rounded-3xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-500/40 hover:bg-white/[0.04]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
              {product.badge}
            </div>
            <Badge>{product.category}</Badge>
          </div>

          <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
                {product.category === 'Telecom' ? <Smartphone className="h-5 w-5" /> : product.category === 'Streaming' ? <ShieldCheck className="h-5 w-5" /> : <PackageCheck className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="text-xs text-slate-400">{product.variants.length} variants</p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-300">{product.description}</p>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">from</p>
              <p className="text-2xl font-black text-white">${product.variants[0].price}</p>
            </div>
            <Button asChild className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
              <a href={`/products/${product.slug}`}>View</a>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
