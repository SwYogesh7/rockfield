import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Button } from '@/components/ui/button'

export default function DesignSystemPage() {
  return (
    <div className="bg-ivory-50 min-h-screen pt-20 pb-24 flex flex-col gap-12">
      <PageHeader 
        title="Design System" 
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Design System' }]}
        description="A showcase of the UI primitives built for Phase 1."
      />

      <Container>
        <Section size="sm" className="bg-ivory-100 mb-8 border border-ivory-300 rounded-[var(--radius-sm)]">
          <SectionHeading 
            eyebrow="Primitive" 
            title={<span><em className="italic text-gold-500">Section</em> Size SM</span>}
            link={{ label: 'View Source', href: '#' }}
            className="px-6 md:px-12"
          />
          <p className="type-body px-6 md:px-12">Uses py-8 md:py-12 (32px / 48px). Perfect for compact content rows.</p>
        </Section>

        <Section size="md" className="bg-ivory-100 mb-8 border border-ivory-300 rounded-[var(--radius-sm)]">
          <SectionHeading 
            eyebrow="Primitive" 
            title={<span><em className="italic text-gold-500">Section</em> Size MD</span>}
            className="px-6 md:px-12"
          />
          <p className="type-body px-6 md:px-12">Uses py-12 md:py-20 (48px / 80px). Standard section spacing.</p>
        </Section>

        <Section size="lg" className="bg-ivory-100 mb-8 border border-ivory-300 rounded-[var(--radius-sm)]">
          <SectionHeading 
            eyebrow="Primitive" 
            title={<span><em className="italic text-gold-500">Section</em> Size LG</span>}
            className="px-6 md:px-12"
          />
          <p className="type-body px-6 md:px-12">Uses py-16 md:py-28 (64px / 112px). For hero or statement sections.</p>
        </Section>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 bg-white border border-ivory-300 rounded-[var(--radius-sm)]">
            <h3 className="type-h3 mb-6">Buttons (Replacing old classes)</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          <div className="p-8 bg-white border border-ivory-300 rounded-[var(--radius-sm)]">
            <h3 className="type-h3 mb-6">ImageWithFallback</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="type-label mb-2">Valid Image</p>
                <div className="aspect-shoe-card rounded-[var(--radius-sm)] overflow-hidden">
                  <ImageWithFallback src="/placeholders/shoe.svg" alt="Valid" fill className="object-cover" />
                </div>
              </div>
              <div>
                <p className="type-label mb-2">Broken Image (Shows SVG)</p>
                <div className="aspect-shoe-card rounded-[var(--radius-sm)] overflow-hidden border border-ivory-300">
                  <ImageWithFallback src="/broken-image.jpg" alt="Broken" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}


