import ProductCard from '@/components/product/ProductCard'
import { getBestSellers } from '@/services/products'
import Link from 'next/link'

export default async function BestSellers() {
  const products = await getBestSellers(4)

  return (
    <section className="py-20 bg-ivory-50">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gold-500" />
              <span className="type-eyebrow text-gold-500">Most Loved</span>
            </div>
            <h2 className="type-h2 text-dark-900">
              Best <em className="italic text-gold-500">Sellers</em>
            </h2>
          </div>
          
          <Link
            href="/shop?sortBy=rating"
            className="type-label text-gold-500 border-b border-gold-500 pb-0.5 hover:opacity-80 transition-opacity"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              data={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
