import { Skeleton } from '@/components/ui/skeleton'

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-6">
        <Skeleton className="h-3 w-20 mb-3 bg-[#e8e2d8]" />
        <Skeleton className="h-10 w-56 bg-[#e8e2d8]" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pb-24">
        <Skeleton className="h-12 w-full bg-[#e8e2d8] mb-6" />
        <div className="flex gap-12">
          <div className="w-52 flex-shrink-0 hidden lg:block space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 bg-[#e8e2d8]" style={{ width: `${60 + i * 8}%` }} />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full bg-[#e8e2d8]" />
                <Skeleton className="h-3 w-3/4 bg-[#e8e2d8]" />
                <Skeleton className="h-3 w-1/2 bg-[#e8e2d8]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
