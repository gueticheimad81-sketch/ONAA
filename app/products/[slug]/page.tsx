import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { ProductDetailView } from '@/components/storefront/ProductDetailView';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-8 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
          ← Back to storefront
        </Link>
        <ProductDetailView product={product} />
      </div>
    </main>
  );
}
