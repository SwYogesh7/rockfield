import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Design System | Rockfield',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DesignSystemPage() {
  // Prevent access in production completely.
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <main className="container-luxury py-24 min-h-screen">
      <div className="mb-16">
        <h1 className="type-h1 mb-4">Design System</h1>
        <p className="type-body max-w-2xl">
          Dev-only preview page for Rockfield UI components and tokens. This page is excluded from
          production builds and search indexing.
        </p>
      </div>

      <div className="space-y-24">
        {/* ── TYPOGRAPHY ── */}
        <section>
          <h2 className="type-eyebrow mb-8">Typography Scale</h2>
          <div className="space-y-8 max-w-4xl border-l border-ivory-300 pl-8">
            <div>
              <p className="type-display">The quick brown fox</p>
              <p className="type-small mt-2">Display (Cormorant Garamond)</p>
            </div>
            <div>
              <p className="type-h1">The quick brown fox</p>
              <p className="type-small mt-2">H1 (Cormorant Garamond)</p>
            </div>
            <div>
              <p className="type-h2">The quick brown fox</p>
              <p className="type-small mt-2">H2 (Cormorant Garamond)</p>
            </div>
            <div>
              <p className="type-h3">The quick brown fox</p>
              <p className="type-small mt-2">H3 (Cormorant Garamond)</p>
            </div>
            <div>
              <p className="type-h4">The quick brown fox</p>
              <p className="type-small mt-2">H4 (Cormorant Garamond)</p>
            </div>
            <div>
              <p className="type-body">The quick brown fox jumps over the lazy dog.</p>
              <p className="type-small mt-2">Body (Jost)</p>
            </div>
            <div>
              <p className="type-small">The quick brown fox jumps over the lazy dog.</p>
              <p className="type-small mt-2">Small (Jost)</p>
            </div>
            <div>
              <p className="type-label">The quick brown fox</p>
              <p className="type-small mt-2">Label (Jost Uppercase)</p>
            </div>
          </div>
        </section>

        {/* ── COLOURS ── */}
        <section>
          <h2 className="type-eyebrow mb-8">Brand Colours</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-ivory-50 border border-ivory-300 rounded-md">ivory-50</div>
            <div className="p-4 bg-ivory-100 border border-ivory-300 rounded-md">ivory-100</div>
            <div className="p-4 bg-ivory-200 border border-ivory-300 rounded-md">ivory-200</div>
            <div className="p-4 bg-ivory-300 border border-ivory-400 rounded-md">ivory-300</div>

            <div className="p-4 bg-gold-300 text-dark-900 rounded-md">gold-300</div>
            <div className="p-4 bg-gold-400 text-dark-900 rounded-md">gold-400</div>
            <div className="p-4 bg-gold-500 text-dark-900 rounded-md">gold-500</div>
            <div className="p-4 bg-gold-700 text-ivory-50 rounded-md">gold-700</div>

            <div className="p-4 bg-dark-200 text-dark-900 rounded-md">dark-200</div>
            <div className="p-4 bg-dark-400 text-ivory-50 rounded-md">dark-400</div>
            <div className="p-4 bg-dark-700 text-ivory-50 rounded-md">dark-700</div>
            <div className="p-4 bg-dark-900 text-ivory-50 rounded-md">dark-900</div>
          </div>
        </section>

        {/* ── BUTTONS ── */}
        <section>
          <h2 className="type-eyebrow mb-8">Buttons</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <Button variant="primary">Primary CTA</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="gold">Sale / Promo</Button>
            <Button variant="link">Link Style</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* ── INPUTS ── */}
        <section>
          <h2 className="type-eyebrow mb-8">Form Controls</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="type-label">Email Address</label>
                <Input placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <label className="type-label">Error State</label>
                <Input placeholder="Invalid input" aria-invalid="true" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="type-small cursor-pointer">
                  Accept terms and conditions
                </label>
              </div>

              <RadioGroup defaultValue="standard">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="standard" id="r1" />
                  <label htmlFor="r1" className="type-small cursor-pointer">
                    Standard Delivery (Free)
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="express" id="r2" />
                  <label htmlFor="r2" className="type-small cursor-pointer">
                    Express Delivery (₹150)
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <section>
          <h2 className="type-eyebrow mb-8">Tabs (Line variant)</h2>
          <Tabs defaultValue="details" className="max-w-md">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="care">Care</TabsTrigger>
            </TabsList>
            <TabsContent value="details">Product details content goes here.</TabsContent>
            <TabsContent value="materials">Material breakdown goes here.</TabsContent>
            <TabsContent value="care">Care instructions go here.</TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  )
}
