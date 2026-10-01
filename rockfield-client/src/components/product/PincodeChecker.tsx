'use client'

import { useState } from 'react'
import { MapPin, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.length !== 6) return
    
    setStatus('checking')
    // Mock API call
    setTimeout(() => {
      if (['1100', '4000', '5600', '7000'].some(prefix => pincode.startsWith(prefix))) {
        setStatus('valid')
      } else {
        setStatus('invalid')
      }
    }, 800)
  }

  return (
    <div className="mb-10 py-6 border-y border-ivory-300">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-dark-400" />
        <span className="type-label text-dark-900">Check Delivery Options</span>
      </div>
      
      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setPincode(val)
              setStatus('idle')
            }}
            placeholder="Enter Pincode"
            className="w-full border border-ivory-400 bg-transparent px-4 py-3 font-body text-sm focus:outline-none focus:border-dark-900"
          />
          {status === 'valid' && <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />}
          {status === 'invalid' && <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-error" />}
        </div>
        <Button 
          type="submit" 
          variant="secondary"
          disabled={pincode.length !== 6 || status === 'checking'}
        >
          {status === 'checking' ? 'Checking...' : 'Check'}
        </Button>
      </form>
      
      {status === 'valid' && (
        <p className="font-body text-sm text-success mt-3">
          Available for delivery. Usually dispatches in 24 hours.
        </p>
      )}
      {status === 'invalid' && (
        <p className="font-body text-sm text-error mt-3">
          Sorry, we do not currently deliver to this pincode.
        </p>
      )}
    </div>
  )
}
