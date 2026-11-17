import { Metadata } from 'next'
import { WishlistView } from '@/components/wishlist/WishlistView'
import { getProducts } from '@/services/products'

/** One page big enough for the whole catalogue; the wishlist can hold any product. */
const CATALOG_PAGE_SIZE = 200

export const metadata: Metadata = {
  title: 'Wishlist | Rockfield Footwear',
  description: 'The pieces you have saved for later.',
  alternates: {
    canonical: '/wishlist',
  },
  // Saved items live on the shopper's device, so there is nothing useful to index here.
  robots: {
    index: false,
    follow: true,
  },
}

export default async function WishlistPage() {
  // Saved items are only known on the client (localStorage), so send the catalogue down and let
  // the view resolve them against it — that way the cards carry full product data.
  const { items } = await getProducts({}, 'featured', 1, CATALOG_PAGE_SIZE)

  return <WishlistView catalog={items} />
}
