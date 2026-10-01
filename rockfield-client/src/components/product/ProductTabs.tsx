'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProductTabsProps {
  description: string
  materials: string
}

export function ProductTabs({ description, materials }: ProductTabsProps) {
  return (
    <div className="mt-12 md:mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-ivory-300 bg-transparent p-0 mb-6 gap-8 overflow-x-auto hide-scrollbar">
          <TabsTrigger 
            value="description"
            className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-body text-xs tracking-[0.2em] uppercase text-dark-400 data-[state=active]:border-gold-500 data-[state=active]:text-dark-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="materials"
            className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-body text-xs tracking-[0.2em] uppercase text-dark-400 data-[state=active]:border-gold-500 data-[state=active]:text-dark-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Materials & Care
          </TabsTrigger>
          <TabsTrigger 
            value="delivery"
            className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-body text-xs tracking-[0.2em] uppercase text-dark-400 data-[state=active]:border-gold-500 data-[state=active]:text-dark-900 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            Delivery & Returns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-2 outline-none">
          <p className="type-body text-dark-700 whitespace-pre-wrap">{description}</p>
        </TabsContent>
        
        <TabsContent value="materials" className="pt-2 outline-none">
          <ul className="space-y-4">
            <li className="flex flex-col gap-1">
              <span className="type-label text-dark-900">Primary Material</span>
              <span className="type-body">{materials}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="type-label text-dark-900">Care Instructions</span>
              <span className="type-body">Wipe clean with a soft, dry cloth. Avoid exposure to water. Store in the provided dust bag when not in use.</span>
            </li>
          </ul>
        </TabsContent>
        
        <TabsContent value="delivery" className="pt-2 outline-none">
          <div className="space-y-6">
            <div>
              <h4 className="type-h4 mb-2">Free Delivery Across India</h4>
              <p className="type-body">Orders are typically dispatched within 24 hours. Standard delivery takes 3-5 business days depending on your location.</p>
            </div>
            <div>
              <h4 className="type-h4 mb-2">14-Day Returns</h4>
              <p className="type-body">We offer complimentary returns within 14 days of receipt. Items must be unworn, in original condition with tags attached.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
