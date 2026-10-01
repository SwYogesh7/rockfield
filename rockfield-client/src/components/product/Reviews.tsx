'use client'

import { Star } from 'lucide-react'

interface ReviewsProps {
  rating: number
  count: number
}

const MOCK_REVIEWS = [
  { id: 1, author: 'Rahul S.', rating: 5, date: '12 May 2026', text: 'Exceptional quality and perfect fit. The leather is premium and breaking them in was a breeze. Highly recommended.' },
  { id: 2, author: 'Vikram M.', rating: 4, date: '03 Apr 2026', text: 'Great shoes, looks exactly like the pictures. Docking one star because delivery took an extra day.' },
  { id: 3, author: 'Arjun K.', rating: 5, date: '21 Jan 2026', text: 'Comfortable right out of the box. I wear these to the office every day.' },
]

export function Reviews({ rating, count }: ReviewsProps) {
  if (count === 0) {
    return (
      <div className="py-16 md:py-24 border-t border-ivory-300">
        <h2 className="type-h2 mb-4">Customer Reviews</h2>
        <p className="type-body text-dark-400">Be the first to review this product.</p>
      </div>
    )
  }

  return (
    <div className="py-16 md:py-24 border-t border-ivory-300">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* SUMMARY */}
        <div className="md:w-1/3 shrink-0">
          <h2 className="type-h2 mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className="type-display text-dark-900">{rating.toFixed(1)}</span>
            <div className="flex flex-col">
              <div className="flex text-gold-500 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={16} className={i <= Math.round(rating) ? 'fill-current' : ''} />
                ))}
              </div>
              <span className="type-small text-dark-400">Based on {count} reviews</span>
            </div>
          </div>
          <button className="btn-secondary w-full md:w-auto mt-4">Write a Review</button>
        </div>

        {/* LIST */}
        <div className="flex-1 flex flex-col gap-8">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="pb-8 border-b border-ivory-300/50 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-gold-500">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={14} className={i <= review.rating ? 'fill-current' : ''} />
                  ))}
                </div>
                <span className="type-small text-dark-200">{review.date}</span>
              </div>
              <p className="type-body mb-3">{review.text}</p>
              <span className="type-label text-dark-400">{review.author}</span>
            </div>
          ))}
          <button className="type-label text-dark-900 underline underline-offset-4 self-start mt-4 hover:text-gold-500 transition-colors">
            Load More Reviews
          </button>
        </div>

      </div>
    </div>
  )
}
