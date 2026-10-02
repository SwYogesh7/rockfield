import ProductCard from '@/components/product/ProductCard'
import { getBestSellers } from '@/services/products'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default async function BestSellers() {
  const products = await getBestSellers(4)

  return (
    <Section size="lg" className="bg-ivory-50">
      <Container>
        <SectionHeading 
          eyebrow="Most Loved"
          title={<>Best <em className="italic text-gold-500">Sellers</em></>}
          link={{ label: 'VIEW ALL', href: '/shop?sortBy=rating' }}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              data={product}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
