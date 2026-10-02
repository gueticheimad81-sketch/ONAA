import Link from 'next/link';
import { Search, ShoppingCart, Sparkles, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import { ProductCatalog } from '@/components/storefront/ProductCatalog';
import { products } from '@/lib/data';

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-neon">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-wide">ONAA</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="#catalog" className="transition hover:text-white">Catalog</Link>
            <Link href="#features" className="transition hover:text-white">Features</Link>
            <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-white/10 bg-white/5 p-2.5 md:inline-flex">
              <Search className="h-4 w-4 text-slate-300" />
            </button>
            <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">
              <ShoppingCart className="h-4 w-4" />
              Checkout
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-30" />
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Star className="h-3.5 w-3.5" />
              Instant delivery • 24/7 support
            </div>

            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Top-up your digital life in seconds.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Buy telecom top-ups, premium subscriptions, digital gift cards, and cloud licenses with instant fulfillment and secure manual payment verification.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#catalog" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                Browse catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                My orders
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-left">
              {[
                { value: '12K+', label: 'Orders delivered' },
                { value: '99.8%', label: 'Satisfaction' },
                { value: '2 min', label: 'Avg. delivery' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-neon backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Trending</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Quick purchase</h2>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">Live</div>
            </div>

            <div className="mt-6 space-y-4">
              {featured.map((product) => (
                <div key={product.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{product.category}</p>
                    </div>
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase text-cyan-300">
                      {product.badge}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Starting from</p>
                      <p className="text-2xl font-black text-white">${product.variants[0].price}</p>
                    </div>
                    <Link href={`/products/${product.slug}`} className="rounded-full bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Secure checkout', text: 'Manual slip verification with instant admin review workflow.' },
            { icon: Zap, title: 'Faster delivery', text: 'Digital fulfillment and top-up automation across popular services.' },
            { icon: Sparkles, title: 'Premium inventory', text: 'Well-organized category pages for streaming, gaming, telecom and more.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Catalog</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Explore available services</h2>
          </div>
        </div>

        <ProductCatalog products={products} />
      </section>
    </main>
  );
}
