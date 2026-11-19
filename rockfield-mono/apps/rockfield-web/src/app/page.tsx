import Hero from '@/components/layout/Hero'
import Marquee from '@/components/layout/Marquee'
import CategoryTiles from '@/components/sections/CategoryTiles'
import NewArrivals from '@/components/sections/NewArrivals'
import BestSellers from '@/components/sections/BestSellers'
import ShopByUse from '@/components/sections/ShopByUse'
import StoryStrip from '@/components/sections/StoryStrip'
import PromoBanner from '@/components/sections/PromoBanner'
import Newsletter from '@/components/sections/Newsletter'
import { LenisProvider } from '@/components/layout/LenisProvider'

export default function HomePage() {
  return (
    <LenisProvider>
      <Hero />
      <Marquee />
      <CategoryTiles />
      <NewArrivals />
      <ShopByUse />
      <StoryStrip />
      <BestSellers />
      <PromoBanner />
      <Newsletter />
    </LenisProvider>
  )
}
