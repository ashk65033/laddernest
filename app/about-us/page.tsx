"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/PageHeader"
import { Users, Target, Lightbulb, TrendingUp } from "lucide-react"

const stats = [
  { name: 'Active Users', value: '10K+' },
  { name: 'Companies', value: '500+' },
  { name: 'Job Placements', value: '2500+' },
  { name: 'Countries', value: '12' },
]

const values = [
  {
    name: 'Innovation',
    description: 'We constantly push boundaries to find better ways to connect talent with opportunity.',
    icon: Lightbulb,
  },
  {
    name: 'Integrity',
    description: 'We believe in transparent, honest, and fair practices in everything we do.',
    icon: Users,
  },
  {
    name: 'Growth',
    description: 'We are dedicated to the personal and professional growth of every individual we serve.',
    icon: TrendingUp,
  },
  {
    name: 'Impact',
    description: 'We measure our success by the positive change we create in people\'s lives.',
    icon: Target,
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <PageHeader
        title="We Are Laddernest"
        description="We're on a mission to revolutionize the recruitment industry by connecting exceptional talent with world-class opportunities."
      />

      {/* Mission Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
              Built on a foundation of trust and innovation, our core values guide every decision we make.
            </p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg mb-6">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.name}</h3>
                  <p className="text-base text-slate-600 leading-relaxed text-center">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-y-4"
              >
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </span>
                <span className="text-base leading-7 text-slate-300">
                  {stat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}