'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ProductVariant } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedSize: number | null
  onSizeSelect: (size: number) => void
}

export function SizeSelector({ variants, selectedSize, onSizeSelect }: SizeSelectorProps) {
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifySize, setNotifySize] = useState<number | null>(null)

  // Sort sizes for display
  const sortedVariants = [...variants].sort((a, b) => a.size - b.size)

  const handleOosClick = (size: number) => {
    setNotifySize(size)
    setNotifyOpen(true)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="type-label text-dark-900">Select Size (UK)</span>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="type-small underline underline-offset-4 text-dark-400 hover:text-dark-900 transition-colors">
              Size Guide
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="type-h3">Size Guide</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <p className="type-body mb-4">Rockfield footwear follows standard UK sizing. If you are between sizes, we recommend sizing up for boots and going true-to-size for sneakers.</p>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ivory-300">
                    <th className="py-2 type-label">UK</th>
                    <th className="py-2 type-label">US</th>
                    <th className="py-2 type-label">EU</th>
                    <th className="py-2 type-label">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { uk: 6, us: 7, eu: 40, cm: 25 },
                    { uk: 7, us: 8, eu: 41, cm: 26 },
                    { uk: 8, us: 9, eu: 42, cm: 27 },
                    { uk: 9, us: 10, eu: 43, cm: 28 },
                    { uk: 10, us: 11, eu: 44, cm: 29 },
                    { uk: 11, us: 12, eu: 45, cm: 30 },
                  ].map((row) => (
                    <tr key={row.uk} className="border-b border-ivory-300/50">
                      <td className="py-2 type-body font-500">{row.uk}</td>
                      <td className="py-2 type-body text-dark-400">{row.us}</td>
                      <td className="py-2 type-body text-dark-400">{row.eu}</td>
                      <td className="py-2 type-body text-dark-400">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {sortedVariants.map((v) => {
          const isSelected = selectedSize === v.size
          const isOos = v.stock === 0

          return (
            <button
              key={v.id}
              onClick={() => isOos ? handleOosClick(v.size) : onSizeSelect(v.size)}
              className={cn(
                "h-12 border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                "font-body text-sm tracking-wider flex flex-col items-center justify-center relative",
                isSelected
                  ? "border-dark-900 bg-dark-900 text-ivory-100"
                  : isOos
                    ? "border-ivory-300 text-dark-200 bg-ivory-100/50 hover:border-dark-400"
                    : "border-ivory-400 text-dark-700 bg-transparent hover:border-dark-900 hover:text-dark-900"
              )}
            >
              UK {v.size}
              {isOos && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <div className="w-[150%] h-px bg-dark-200 -rotate-12 absolute" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="type-h3">Out of Stock</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="type-body mb-6">UK {notifySize} is currently out of stock. Leave your email and we&apos;ll notify you as soon as it&apos;s back.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setNotifyOpen(false); }}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required
                className="flex-1 border border-ivory-400 bg-transparent px-4 py-3 font-body text-sm focus:outline-none focus:border-dark-900"
              />
              <Button type="submit">Notify Me</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
