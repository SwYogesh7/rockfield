'use client'

// Global cart drawer. Mounted once in the root layout; visibility is driven entirely by the
// cart store (`isOpen`), so any component can open it via `useCartStore().openCart()`.
//
// Desktop (>= 1024px): slides in from the right as a side panel.
// Mobile: bottom sheet with vaul's drag handle + swipe-to-dismiss.

import Link from 'next/link'
import { ArrowRight, ShoppingBag, X } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/components/cart/CartItem'
import { CartCoupon } from '@/components/cart/CartCoupon'
import { useCartStore } from '@/store/cart'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'
import { useSyncCouponDiscount } from '@/lib/hooks/useSyncCouponDiscount'
import { formatPrice } from '@/constants'

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const itemCount = useCartStore((s) => s.getItemCount())
  const subtotal = useCartStore((s) => s.getSubtotal())
  const total = useCartStore((s) => s.getTotal())
  const couponCode = useCartStore((s) => s.couponCode)
  const discountAmount = useCartStore((s) => s.discountAmount)

  const isDesktop = useIsDesktop()
  const isEmpty = items.length === 0

  // Keep a percentage coupon accurate as quantities change.
  useSyncCouponDiscount()

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeCart()
      }}
      direction={isDesktop ? 'right' : 'bottom'}
    >
      <DrawerContent
        data-testid="cart-drawer"
        aria-label="Shopping bag"
        // `group` lets the drag handle inside DrawerContent show on bottom sheets.
        className="group data-[vaul-drawer-direction=right]:sm:max-w-md"
      >
        {/* ── Header ── */}
        <DrawerHeader className="flex-row items-center justify-between">
          <div>
            <DrawerTitle>
              Your Bag
              {itemCount > 0 && (
                <span
                  data-testid="cart-drawer-count"
                  className="ml-2 font-body text-xs font-medium tracking-[0.2em] text-dark-400 align-middle"
                >
                  ({itemCount})
                </span>
              )}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Review the items in your shopping bag, apply a coupon, and proceed to checkout.
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close bag" className="-mr-2">
              <X className="size-4!" strokeWidth={1.5} />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* ── Body ── */}
        {isEmpty ? (
          <EmptyState onNavigate={closeCart} />
        ) : (
          <ul
            data-testid="cart-items"
            aria-label="Items in your bag"
            className="flex-1 min-h-0 overflow-y-auto divide-y divide-ivory-300 px-5 py-5"
          >
            {items.map((item) => (
              <CartItem key={item.variantId} item={item} onNavigate={closeCart} />
            ))}
          </ul>
        )}

        {/* ── Footer ── */}
        {!isEmpty && (
          <DrawerFooter className="gap-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <CartCoupon />

            <dl className="flex flex-col gap-2 font-body text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-dark-700">Subtotal</dt>
                <dd data-testid="cart-subtotal" className="tabular-nums text-dark-900">
                  {formatPrice(subtotal)}
                </dd>
              </div>

              {couponCode && (
                <div className="flex items-center justify-between">
                  <dt className="text-dark-700">
                    Discount{' '}
                    <span className="text-xs tracking-wider text-dark-400">({couponCode})</span>
                  </dt>
                  <dd data-testid="cart-discount" className="tabular-nums text-success">
                    −{formatPrice(discountAmount)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-ivory-300 pt-3">
                <dt className="font-medium text-dark-900">Total</dt>
                <dd
                  data-testid="cart-total"
                  className="font-display text-2xl font-medium tabular-nums text-dark-900"
                >
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            <p className="font-body text-xs text-dark-400">
              Taxes included. Free delivery across India.
            </p>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout" onClick={closeCart}>
                Checkout
                <ArrowRight strokeWidth={1.5} />
              </Link>
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

function EmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      data-testid="cart-empty"
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-ivory-200 text-dark-400">
        <ShoppingBag size={24} strokeWidth={1.25} />
      </div>
      <div>
        <p className="font-display text-2xl font-medium text-dark-900">Your bag is empty</p>
        <p className="mt-1 font-body text-sm text-dark-400">
          Nothing here yet — let&apos;s find your next pair.
        </p>
      </div>
      <Button asChild variant="secondary" className="mt-2">
        <Link href="/shop" onClick={onNavigate}>
          Continue shopping
        </Link>
      </Button>
    </div>
  )
}
