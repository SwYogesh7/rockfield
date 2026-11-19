'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterForm = z.infer<typeof newsletterSchema>

export default function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true)
    console.log('Newsletter subscription mock:', data.email)
    // Mock network request
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
    toast.success('Successfully subscribed to the newsletter!')
    reset()

    // Reset success state after a few seconds
    setTimeout(() => setIsSuccess(false), 5000)
  }

  return (
    <Section className="bg-ivory-100 border-y border-ivory-300">
      <Container className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-6 h-px bg-gold-500" />
            <span className="type-eyebrow text-gold-500">Join the Club</span>
            <span className="block w-6 h-px bg-gold-500" />
          </div>
          
          <h2 className="type-h2 text-dark-900 mb-4">
            Become a Rockfield <em className="italic text-gold-500">Insider</em>
          </h2>
          
          <p className="type-body text-dark-400 mb-10 max-w-lg mx-auto">
            Subscribe to receive updates on new arrivals, exclusive access to sales, and insider-only offers.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto relative">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <div className="flex-1 text-left relative">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full bg-white h-12 ${errors.email ? 'border-error' : ''}`}
                  disabled={isSubmitting || isSuccess}
                />
                {errors.email && (
                  <span className="absolute -bottom-6 left-0 text-[0.6875rem] text-error font-body">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <Button 
                type="submit" 
                variant="primary" 
                className="h-12 px-8 w-full sm:w-auto"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? 'Joining...' : isSuccess ? 'Joined' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </motion.div>
      </Container>
    </Section>
  )
}
